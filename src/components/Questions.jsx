import React from "react"

function Faqs() {
  const faqs = [
    {
      question: "What services do you offer?",
      answer:
        "We offer a wide range of services including web development, mobile app development, and cloud solutions.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can contact our support team via email at support@example.com or through our 24/7 live chat on our website.",
    },
    {
      question: "Do you offer custom solutions?",
      answer: "Yes, we provide custom solutions tailored to meet the specific needs of our clients.",
    },
  ]

  return (
    <section className="py-12 bg-pink-200">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faqs