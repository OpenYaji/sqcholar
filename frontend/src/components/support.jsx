"use client"

import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { ChevronDown } from "lucide-react"

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      category: "Account",
      questions: [
        {
          question: "How do I change my password?",
          answer: 'Go to your account settings and click "Change Password."',
        },
        {
          question: "How do I update my profile picture?",
          answer: 'In your profile settings, click "Upload Profile Picture."',
        },
      ],
    },
    {
      category: "Grades",
      questions: [
        {
          question: "How do I view my grades?",
          answer: 'Click on the "Grades" tab in the dashboard.',
        },
      ],
    },
  ]

  return (
    <div className="py-6">
      <Card className="mb-6 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold">Support</h2>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fadeIn">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Contact Us</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">Email: qcuregistrar@example.com</p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Phone: 1-800-0000</p>

            <form className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject:
                </label>
                <Input id="subject" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message:
                </label>
                <Textarea id="message" rows={5} />
              </div>

              <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="animate-fadeIn">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Frequently Asked Questions</h3>
            <Input type="text" placeholder="Search FAQs..." className="mb-6" />

            <div className="space-y-6">
              {faqs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">{category.category}</h4>
                  <div className="space-y-3">
                    {category.questions.map((faq, faqIndex) => {
                      const index = categoryIndex * 10 + faqIndex
                      return (
                        <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                          <button
                            className="flex justify-between items-center w-full text-left font-medium text-gray-800 dark:text-white"
                            onClick={() => toggleFaq(index)}
                          >
                            <span>{faq.question}</span>
                            <ChevronDown
                              className={`h-5 w-5 transition-transform ${openFaq === index ? "transform rotate-180" : ""}`}
                            />
                          </button>
                          {openFaq === index && (
                            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">{faq.answer}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
