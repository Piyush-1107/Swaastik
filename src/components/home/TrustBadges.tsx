export function TrustBadges() {
  const badges = [
    {
      icon: "🏆",
      title: "100% BIS Hallmarked",
      description: "Certified purity guaranteed"
    },
    {
      icon: "🔒",
      title: "Secure Payments",
      description: "Multiple payment options"
    },
    {
      icon: "🚚",
      title: "Free Shipping",
      description: "On orders above ₹5,000"
    },
    {
      icon: "↩️",
      title: "Easy Returns",
      description: "30-day return policy"
    },
    {
      icon: "🤝",
      title: "Trusted Since 1995",
      description: "28+ years of excellence"
    }
  ]

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="text-center p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{badge.title}</h3>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
