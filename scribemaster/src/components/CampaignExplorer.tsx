import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"

const CampaignExplorer = () => {
  return (
    <div className="flex h-full">
    
        {/* file explorer*/}
        <div className="w-1/3 border-r p-4 bg-muted">
            <h2 className="font-bold mb-4">Files</h2>
            <ul className="space-y-2">
            hello
            </ul>
        </div>
    
        {/* content viewer*/}
        <div className="w-2/3 p-4">
            <Card className="h-full">
            <CardHeader>
                <CardTitle>Note Title</CardTitle>
            </CardHeader>
            <CardContent>
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                Note Contents
                </pre>
            </CardContent>
            </Card>
        </div>
    </div>
  )
}

export default CampaignExplorer