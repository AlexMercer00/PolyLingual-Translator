import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe2, Mic, FileText, AlertTriangle, Languages, Smartphone } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Globe2 className="h-6 w-6" />,
      title: "Real-Time Translation",
      description: "Instant translation across multiple languages powered by advanced AI models."
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Voice Translation",
      description: "Speak directly and get instant translations with dialect detection."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Document Translation",
      description: "Upload and translate PDF, DOCX, or TXT files while maintaining formatting."
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Error Detection",
      description: "Built-in spelling and grammar checker for accurate translations."
    },
    {
      icon: <Languages className="h-6 w-6" />,
      title: "Multiple Languages",
      description: "Support for major world languages and regional dialects."
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile Friendly",
      description: "Responsive design that works perfectly on all devices."
    }
  ]

  return (
    <section className="py-20 bg-muted/50" aria-labelledby="features-title">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 id="features-title" className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Powerful Features
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Everything you need for seamless translation in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 transition-all hover:border-primary/50">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10" aria-hidden="true">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}