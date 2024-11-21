import React from 'react';

interface ContactSectionProps {
    contact: string,
    message: string,
    submit: string
}

export const ContactSection: React.FC<ContactSectionProps> = ({contact, message, submit}) => {
    return (
        <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="container mx-auto">

                <h2 className="text-3xl font-bold text-gray-900 mb-8">{contact}</h2>
                <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                            <input
                                type="email"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 bg-gray-50 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{message}</label>
                            <textarea
                                rows={4}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 bg-gray-50 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                        >
                            {submit}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}