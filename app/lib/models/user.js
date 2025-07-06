import { connectToDatabase } from "../mongodb"
import bcrypt from "bcryptjs"

export async function createUser(userData) {
  const { db } = await connectToDatabase()

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 12)

  const user = {
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    profileImage: userData.profileImage || null,
    isActive: true,
    createdAt: new Date(),
    lastLogin: null,
    updatedAt: new Date(),
  }

  const result = await db.collection("users").insertOne(user)
  return { ...user, _id: result.insertedId }
}

export async function getUserByEmail(email) {
  const { db } = await connectToDatabase()
  return await db.collection("users").findOne({ email })
}

export async function getUserById(id) {
  const { db } = await connectToDatabase()
  const { ObjectId } = require("mongodb")

  try {
    return await db.collection("users").findOne({ _id: new ObjectId(id) })
  } catch (error) {
    // If ObjectId conversion fails, try string ID
    return await db.collection("users").findOne({ _id: id })
  }
}

export async function getAllUsers() {
  const { db } = await connectToDatabase()
  return await db.collection("users").find({}).sort({ createdAt: -1 }).toArray()
}

export async function updateUserLastLogin(userId) {
  const { db } = await connectToDatabase()
  const { ObjectId } = require("mongodb")

  try {
    await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { lastLogin: new Date() } })
  } catch (error) {
    // If ObjectId conversion fails, try string ID
    await db.collection("users").updateOne({ _id: userId }, { $set: { lastLogin: new Date() } })
  }
}

export async function updateUser(userId, updateData) {
  const { db } = await connectToDatabase()
  const { ObjectId } = require("mongodb")

  const update = {
    ...updateData,
    updatedAt: new Date(),
  }

  try {
    const result = await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: update })
    return result
  } catch (error) {
    // If ObjectId conversion fails, try string ID
    const result = await db.collection("users").updateOne({ _id: userId }, { $set: update })
    return result
  }
}

export async function deleteUser(userId) {
  const { db } = await connectToDatabase()
  const { ObjectId } = require("mongodb")

  try {
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(userId) })
    return result
  } catch (error) {
    // If ObjectId conversion fails, try string ID
    const result = await db.collection("users").deleteOne({ _id: userId })
    return result
  }
}
