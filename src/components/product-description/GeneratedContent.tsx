 export function GeneratedContent({ content = {} }: GeneratedContentProps) {
     const {
       marketingHooks = [],
       seoDescriptions = [],
       metaDescription = '',
       seoTitles = []
     } = content;

     console.log("GeneratedContent received:", content);

     return (
       <div className="space-y-8">
         {seoTitles.length > 0 && (
           <Card>
             <CardHeader>
               <CardTitle>SEO Title Options</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 {seoTitles.map((title, index) => (
                   <div key={index} className="space-y-2">
                     <h3 className="font-medium text-sm text-muted-foreground">Version {index + 1}</h3>
                     <ContentSection content={title} />
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
         )}
         {/* similar code for other sections */}
       </div>
     );
   }
   ```
