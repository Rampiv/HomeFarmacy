import { Route, Routes } from "react-router"
import "./App.scss"
import React from "react"
import { Main } from "./pages"

const MainMemo = React.memo(Main)

export default function App() {
  return (
    <div className="App">
      <main className="main">
        <div className="container">
          <Routes>
            <Route path={"/"} element={<MainMemo />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
