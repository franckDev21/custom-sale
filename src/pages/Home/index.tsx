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
            Simplifiez vous la vie avec
          </h2>
          <h1 className='text-6xl font-bold py-5'>Notre logiciel <br /> extraordinaire de gestion </h1>
          <p className='mt-2 w-[70%] my-5 leading-10'>
            La seule plate-forme dont vous aurez besoin pour la gestion complète de votre entreprise: <br />
            Gestion comptable, gestion de stock, gestion commerciale , gestions des ressources humaines  .
          </p>
          <div className='ml-4 text-lg mt-10'>
            <Link to='/star' className='px-4 py-2 bg-[#ac3265] active:scale-[96%] inline-block hover:bg-[#5c3852] hover:border-transparent transition border-2 border-[#7e3151] rounded-md font-bold' >Demander mon accès</Link>
            <Link to='/contact' className='px-4 py-2 font-bold active:scale-[96%] inline-block bg-[#ffffff20] border-2 border-transparent rounded-md ml-2 bg-opacity-50 transition' > contactez nous </Link>
          </div>
        </div>
      </Banner>
    </AuthLayout>
    
  </>
}

export default Home