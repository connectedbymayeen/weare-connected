"use client"

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
                                <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                >
                                        <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4 12v.01M12 4v.01M20 12v.01M12 20v.01M16.24 7.76l-8.48 8.48"
                                        />
                                </svg>
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
