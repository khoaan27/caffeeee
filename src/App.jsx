
import { CoffeeForm, Hero, History, Layout,Stats } from './components'
import { useAuth } from './context/AuthContext'
import { coffeeConsumptionHistory } from './ultis'
function App() {
  const {globalUser,globalData,isLoading}=useAuth()
  const isAuthenticated= globalUser
  const isData=globalData && !!Object.keys(globalData || {}).length

  const authenticatedContent=(
    <>
      <Stats/>
      <History/> 
    </>
  )

  return (
    <Layout>
        <Hero/>
        <CoffeeForm isAuthenticated={isAuthenticated} />
        {(isAuthenticated && isLoading) && (
          <p>Loading data...</p>
        )}
        {(isAuthenticated && isData ) && (authenticatedContent) }
    </Layout>
    
  )
}

export default App
