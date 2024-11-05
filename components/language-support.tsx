import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function LanguageSupport() {
  const languages = [
    "English", "Spanish", "French", "German", "Italian", "Portuguese",
    "Russian", "Chinese", "Japanese", "Korean", "Hindi", "Ukrainian"
  ]

  return (
    <section className="py-20" aria-labelledby="supported-languages-title">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 id="supported-languages-title" className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Supported Languages
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Translate between any of these languages with high accuracy
          </p>
        </div>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {languages.map((language) => (
                <Badge
                  key={language}
                  variant="secondary"
                  className="text-sm py-1 px-3"
                >
                  {language}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
