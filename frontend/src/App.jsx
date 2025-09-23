
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Editor from "@monaco-editor/react";


function App() {
  return (

    <div className="bg-black h-screen w-screen flex flex-col ">
      <div className="h-10 "></div> //nav

      <ResizablePanelGroup direction="horizontal" className="flex-1   ">
         //left
        <ResizablePanel className=" rounded-xl border border-zinc-300  ">
          <div className="w-screen bg-zinc-900 ">
            <div className=" h-10  bg-zinc-800 overflow-y-auto ">

            </div>

          </div>
        </ResizablePanel>
        
        <ResizableHandle

          className="
            w-[3px] 
            bg-gray-600
            h-3
            m-1
            hover:bg-blue-500 
            hover:h-full
            data-[state=active]:bg-blue-500 
            my-auto
            
          " />
          
        <ResizablePanel >
          <div className="h-full">
            <ResizablePanelGroup direction="vertical" >
              <ResizablePanel className="rounded-xl border border-zinc-300 flex flex-col ">
                <div className=" h-10  bg-zinc-800 overflow-y-auto ">

                </div>


                <div className="flex-1">
                  <Editor
                    className="h-full w-full "
                    defaultLanguage="javascript"
                    defaultValue="// Start coding..."
                    theme="vs-dark"
                     options={{
    fontSize: 12,               
    lineDecorationsWidth: 8,
  }}

                  />
                </div>
              </ResizablePanel>
              
              <ResizableHandle className="
            
            bg-gray-600
            h-10
            
            m-1
            hover:bg-blue-500 
            
            data-[state=active]:bg-blue-500 
            mx-auto
            
          " />
              <ResizablePanel className="rounded-xl border border-zinc-300  flex-1 "><div className="w-screen  bg-zinc-900 ">
                <div className=" h-10  bg-zinc-800 overflow-y-auto ">

                </div>

              </div></ResizablePanel>
            </ResizablePanelGroup>

          </div>
        </ResizablePanel >
      </ResizablePanelGroup>
    </div>

  )
}

export default App
