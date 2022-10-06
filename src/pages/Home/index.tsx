import React from 'react'
import Banner from '../../molecules/Banner'
import { Link} from 'react-router-dom'
import AuthLayout from '../../templates/AuthLayout'

type typeHome = {}

const Home: React.FC<typeHome> = () => {
  return <>
    <AuthLayout>
      <Banner classname='text-white '>
        <div className='pb-20'>
          <h2 className='text-2xl mb-4'>
            Des employés extraordinaires méritent
          </h2>
          <h1 className='text-6xl font-bold py-5'>un logiciel <br /> extraordinaire</h1>
          <p className='mt-2 w-[70%] my-5'>
            La seule plate-forme dont vous aurez besoin pour gérer votre entreprise : <br />
            des applications intégrées, simples et appréciées par des millions d'utilisateurs satisfaits.
          </p>
          <div className='ml-4 text-lg mt-10'>
            <Link to='/' className='px-4 py-2 bg-[#5c3652] active:scale-[96%] inline-block hover:bg-[#5c3852] hover:border-transparent transition border-2 border-[#442a3d] rounded-md font-bold' >Demarer maintenant</Link>
            <Link to='/' className='px-4 py-2 font-bold active:scale-[96%] inline-block hover:bg-[#ffffff20] border-2 border-transparent rounded-md ml-2 bg-opacity-50 transition' > contactez nous </Link>
          </div>
        </div>
      </Banner>
    </AuthLayout>
    
  </>
}

export default Home