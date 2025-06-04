import { useState } from 'react';
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { FileText } from 'lucide-react';

const CampaignReader = () => {
  return (
    <Card className='w-full max-w-md mx-auto'>
        <CardHeader>
            <CardTitle>
                <FileText className='w-4 h-4' />
                Campaign Reader
            </CardTitle>
        </CardHeader>
        <CardContent className='grid gap-4'>

        </CardContent>
    </Card>

  )
}

export default CampaignReader