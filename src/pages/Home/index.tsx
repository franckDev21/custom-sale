import React from 'react'
import Banner from '../../molecules/Banner'
import { Link} from 'react-router-dom'
import DashImage from '../../assets/img/dash.svg'

type typeHome = {}

const Home: React.FC<typeHome> = () => {
  return <>
    <Banner classname='text-white' classnameContent='flex mt-16 items-center justify-start space-x-6'>
        <div className='pb-20 w-[70%]'>
          <h2 className='text-2xl mb-3'>
            Simplifiez vous la vie avec
          </h2>
          <h1 className='text-5xl font-bold py-4' style={{ lineHeight: '1.3' }}>Notre logiciel <br /> extraordinaire de gestion </h1>
          <p className='mt-2 w-[70%] mb-4'>
            La seule plate-forme dont vous aurez besoin pour la gestion complète de votre entreprise: <br />
            Gestion comptable, gestion de stock, gestion commerciale , gestions des ressources humaines  .
          </p>
          <div className='ml-4 text-lg mt-10'>
            <Link to='/star' className='px-4 py-2 bg-white text-primary active:scale-[96%] inline-block hover:bg-primary hover:text-white transition  rounded-full font-bold' >Demander mon accès</Link>
            {/* <Link to='/contact' className='px-4 py-2 font-bold active:scale-[96%] inline-block bg-[#203A62] border-2 border-transparent rounded-full ml-2 transition' > contactez nous </Link> */}
            <Link to='/contact' className='px-4 py-2 font-bold active:scale-[96%] inline-block bg-[#203A62] border-2 border-transparent rounded-full ml-2 transition' > contactez nous </Link>
          </div>
        </div>
        <img className='inline-block top-10 -right-14 absolute' width={600} src={DashImage} alt="" />
      </Banner>
  </>
}

export default Home