export function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      comment: "Beautiful jewelry with excellent quality. The BIS hallmarking gave me confidence in my purchase. Highly recommended!",
      product: "Gold Necklace Set"
    },
    {
      name: "Rahul Patel",
      location: "Delhi",
      rating: 5,
      comment: "Bought an engagement ring from Swastik Gems. The craftsmanship is outstanding and the price was very reasonable.",
      product: "Diamond Ring"
    },
    {
      name: "Anita Singh",
      location: "Bangalore",
      rating: 5,
      comment: "Amazing customer service and fast delivery. The earrings were exactly as shown in the pictures. Very satisfied!",
      product: "Pearl Earrings"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Read authentic reviews from our satisfied customers who trust us for their jewelry needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-muted/30 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              {/* Star rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-primary text-lg">★</span>
                ))}
              </div>

              {/* Comment */}
              <blockquote className="text-muted-foreground mb-4 italic">
                "{testimonial.comment}"
              </blockquote>

              {/* Customer info */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-secondary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-primary font-medium">Purchased</p>
                    <p className="text-xs text-muted-foreground">{testimonial.product}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👥</span>
              <span>1000+ Happy Customers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⭐</span>
              <span>4.8/5 Average Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏆</span>
              <span>28+ Years Experience</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
