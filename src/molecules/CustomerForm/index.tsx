import { Spinner } from 'flowbite-react'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import Loader from '../../atoms/Loader'
import Customer from '../../Model/Customer'
import Storage from '../../service/Storage'
import { http_client } from '../../utils/axios-custum'

type TypeCustomerForm = {
  onClickBack ?: (value: boolean) => void,
  addNewClient ?: (value: boolean) => void
}

const CREATE_CUSTOMERS_URL = '/customers';
const CustomerForm: React.FC<TypeCustomerForm> = ({ onClickBack = () => {}, addNewClient = () => {} }) => {

  const [customer,setCustomer] = useState<Customer>({})
  const [errForm, setErrForm] = useState('');
  const [sending,setSending] = useState(false)

  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    if(errForm) setErrForm('');

    switch (e.target.name) {
      case 'firstname':
        setCustomer({...customer,firstname : e.target.value})
        break;
      case 'lastname':
        setCustomer({...customer,lastname : e.target.value})
        break;
      case 'email':
        setCustomer({...customer,email : e.target.value})
        break;
      case 'tel':
        setCustomer({...customer,tel : e.target.value})
        break;
      case 'address':
        setCustomer({...customer,address : e.target.value})
        break;
        // address
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setSending(true)

    http_client(Storage.getStorage('auth').token).post(CREATE_CUSTOMERS_URL,customer)
      .then(res => {
        setSending(false);
        addNewClient(true)
      })
      .catch(err => {
        setSending(false);
        setErrForm(err.response.data.message)
        console.log(err);
      });
  }

  return (
    <form onSubmit={handleSubmit} className='text-gray-600 w-1/2'>
      <header className='text-2xl font-bold pb-3 border-b mb-4'>Creation d'un nouveau client</header>
      
      {errForm && <div className='py-1 font-bold mb-4 text-sm text-center rounded-md text-red-500 bg-red-100'>{errForm}</div>}

      <div className="flex justify-between mb-4">
        <div className='flex w-1/2 mr-2 flex-col justify-start items-start'>
          <label className='font-bold mb-1'>Nom </label>
          <input name='lastname' onChange={handleOnchange} value={customer.lastname || ''} required type="text"  placeholder='Entrer le nom du client' className='px-6 w-full py-2 bg-gray-100 rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-600 outline-none border-none' />
        </div>
        <div className='flex w-1/2 ml-2 flex-col justify-start items-start'>
          <label className='font-bold mb-1'>Prenom </label>
          <input name='firstname' onChange={handleOnchange} value={customer.firstname || ''} required type="text" placeholder='Entrer le prénom du client' className='px-6 w-full py-2 bg-gray-100 rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-600 outline-none border-none' />
        </div>
      </div>
      <div className="flex justify-between mb-5">
        <div className='flex w-1/2 mr-2 flex-col justify-start items-start'>
          <span><label className='font-bold mb-2 inline-block'>Email </label> <span className="text-gray-400 text-sm italic font-normal"> (Facultatif)</span></span>
          <input name='email' onChange={handleOnchange} value={customer.email || ''} type="email"  placeholder='Email du client' className='px-6 w-full py-2 bg-gray-100 rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-600 outline-none border-none' />
        </div>
        <div className='flex w-1/2 ml-2 flex-col justify-start items-start'>
          <span><label className='font-bold mb-2 inline-block'>Adresse </label> <label className='font-bold mb-1'> </label> <span className="text-gray-400 text-sm italic font-normal"> (Facultatif)</span></span>
          <input name='address' onChange={handleOnchange} value={customer.address || ''} type="address"  placeholder='Adresse du client' className='px-6 w-full py-2 bg-gray-100 rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-600 outline-none border-none' />
        </div>
      </div>
      <div className="text-center mt-6 flex justify-center">
        <span onClick={_ => onClickBack(false)} className="px-6 mr-3 inline-block rounded-md font-bold py-2 cursor-pointer bg-secondary text-white">Retour</span>
        <button type='submit' className="px-6 cursor-pointer inline-flex justify-center items-center rounded-md font-bold py-2 bg-primary text-white">{sending ? <Loader className='text-xl' /> :'Enregistrer'}</button>
      </div>
    </form>
  )
}

export default CustomerForm