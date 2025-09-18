import Main from "./main"
import Header from "@/components/header"

export default async function DemoPage() {

  return (
    <div>
       <Header></Header>
      <div className="container mx-auto py-20">
        <Main></Main>
      </div>
    </div>
  )
}
