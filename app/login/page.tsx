'use client'

import { useState, ChangeEvent, FormEvent } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface FormData {
    firstname: string
    lastname: string
    email: string
    password: string
}

export default function Auth() {
    const { data: session } = useSession()
    const router = useRouter()

    const [formData, setFormData] = useState<FormData>({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    })

    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showThankYou, setShowThankYou] = useState<boolean>(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
        if (error) setError(null)
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Sign up failed')
            }

            setShowThankYou(true)
            toast.success('Welcome to the Vito-x music community!', {
                position: "top-center",
                autoClose: 5000,
            })

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
            console.error('Auth error:', error)
            setError(errorMessage)
            toast.error(errorMessage, {
                position: "top-center",
                autoClose: 3000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (session?.user?.email) {
        return (
            <div className="flex flex-col items-center justify-center h-[90vh] gap-4">
                <h1 className="text-2xl">Signed in as {session.user.email}</h1>
                <button
                    onClick={() => signOut()}
                    className="bg-primary dark:bg-outline text-white py-2 px-4 rounded-md"
                >
                    Sign Out
                </button>
            </div>
        )
    }

    if (showThankYou) {
        return (
            <div className="flex flex-col items-center justify-center h-[90vh] gap-6 px-4">
                <h1 className="text-4xl font-bold text-center">Thank You for Joining Vito-x!</h1>
                <div className="max-w-md text-center space-y-4">
                    <p className="text-xl">Your creative journey in music making begins now!</p>
                    <p>We&apos;re excited to have you as part of our community of songwriters, producers, and music enthusiasts.</p>
                    <p className="text-sm text-gray-400">Check your email for a confirmation message with next steps.</p>
                </div>
                <div className="flex gap-4 mt-6">
                    <button
                        onClick={() => router.push('/')}
                        className="bg-primary dark:bg-outline text-white py-2 px-6 rounded-md"
                    >
                        Explore Vito-x
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
            <ToastContainer />
            <div className="flex items-center justify-center w-full h-[90vh]">
                <div className="flex items-center justify-center sm:w-[50%]">
                    <div className="flex flex-col gap-4 bg-gray-500/10 p-10 rounded-lg border border-white/20 shadow-primary-glow">
                        <h1 className="text-4xl font-normal text-center my-5">
                            Sign up to Continue
                        </h1>
                        <p className="text-center text-sm text-gray-400">
                            Sign up for Vito-x to start creating music
                        </p>
                        <form className="flex flex-col gap-4 mt-4 mb-10 px-10" onSubmit={handleSubmit}>
                            <div className="flex gap-4">
                                <input 
                                    type="text" 
                                    name="firstname"
                                    placeholder="First name" 
                                    className="py-3 px-2 rounded-md outline-none w-full text-black"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    required
                                    minLength={2}
                                    maxLength={50}
                                />
                                <input 
                                    type="text" 
                                    name="lastname"
                                    placeholder="Last name"  
                                    className="py-3 px-2 rounded-md outline-none w-full text-black"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    required
                                    minLength={2}
                                    maxLength={50}
                                />
                            </div>
                            <input 
                                type="email" 
                                name="email"
                                placeholder="Email" 
                                className="border-b-2 py-3 rounded-sm px-2 outline-none text-black"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <input 
                                type="password" 
                                name="password"
                                placeholder="Password" 
                                className="border-b-2 py-3 rounded-md px-2 outline-none text-black"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                                maxLength={100}
                            />
                            <button 
                                type="submit" 
                                className="bg-primary dark:bg-outline text-white py-2 rounded-md"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : 'Sign Up'}
                            </button>
                        </form>
                        {error && (
                            <p className="text-red-500 text-center text-sm px-4">
                                {error}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-center sm:w-[50%]"></div>
            </div>
        </>
    )
}
