"use client"

import { Share2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import {
        FacebookIcon,
        FacebookShareButton,
        LinkedinIcon,
        LinkedinShareButton,
        TwitterIcon,
        TwitterShareButton,
        WhatsappIcon,
        WhatsappShareButton,
} from "react-share"
export default function ShareButton({ url, title }) {
        const [open, setOpen] = useState(false)
        const ref = useRef()

        // Close dropdown if clicked outside
        useEffect(() => {
                function handleClickOutside(event) {
                        if (ref.current && !ref.current.contains(event.target)) {
                                setOpen(false)
                        }
                }
                document.addEventListener("mousedown", handleClickOutside)
                return () => {
                        document.removeEventListener("mousedown", handleClickOutside)
                }
        }, [ref])

        return (
                <div className="relative inline-block text-left" ref={ref}>
                        <button
                                onClick={() => setOpen(!open)}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100"
                                type="button"
                                aria-haspopup="true"
                                aria-expanded={open}
                        >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                        </button>

                        {open && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-3 flex justify-around">
                                        <FacebookShareButton url={url} quote={title} className="cursor-pointer">
                                                <FacebookIcon size={32} round />
                                        </FacebookShareButton>
                                        <TwitterShareButton url={url} title={title} className="cursor-pointer">
                                                <TwitterIcon size={32} round />
                                        </TwitterShareButton>
                                        <WhatsappShareButton url={url} title={title} separator=":: " className="cursor-pointer">
                                                <WhatsappIcon size={32} round />
                                        </WhatsappShareButton>
                                        <LinkedinShareButton url={url} title={title} className="cursor-pointer">
                                                <LinkedinIcon size={32} round />
                                        </LinkedinShareButton>
                                </div>
                        )}
                </div>
        )
}
