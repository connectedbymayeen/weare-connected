import { ObjectId } from "mongodb"
import clientPromise from "../mongodb"
import bcrypt from "bcryptjs"

export async function getAdminCollection() {
  const client = await clientPromise
  return client.db(process.env.MONGODB_DB).collection("admins")
}

export async function createAdmin({ username, password, name, email }) {
  const admins = await getAdminCollection()

  // Check if admin already exists
  const existingAdmin = await admins.findOne({
    $or: [{ username }, { email }],
  })

  if (existingAdmin) {
    throw new Error("Admin with this username or email already exists")
  }

  // Hash password
  const salt = await bcrypt.genSalt(12) // Higher salt rounds for admin
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create admin
  const result = await admins.insertOne({
    username,
    password: hashedPassword,
    name,
    email,
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: null,
  })

  return { id: result.insertedId, username, name, email, role: "admin" }
}

export async function findAdminByUsername(username) {
  const admins = await getAdminCollection()
  return admins.findOne({ username })
}

export async function findAdminById(id) {
  const admins = await getAdminCollection()
  return admins.findOne({ _id: new ObjectId(id) })
}

export async function updateAdminLastLogin(id) {
  const admins = await getAdminCollection()
  return admins.updateOne({ _id: new ObjectId(id) }, { $set: { lastLogin: new Date(), updatedAt: new Date() } })
}
