import { useRoutes } from "react-router-dom"
import { routes } from "@routes"


//Example Data
// eslint-disable-next-line
const user1 = {
    id: 1,
    name: "Nguyen Van A",
    role: "member"
}

const user2 = {
    id: 2,
    name: "Nguyen Van B",
    role: "admin"
}
// eslint-disable-next-line
const user3 = {
    id: 3,
    name: "Nguyen Van B",
    role: "staff"
}

const App = () => {

  const element = useRoutes(routes(user2));
  return element;

}

export default App;
