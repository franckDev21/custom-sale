import React, { ChangeEvent, FC, FormEvent, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../../atoms/Loader';
import Customer from '../../../Model/Customer';
import Storage from '../../../service/Storage';
import UserService from '../../../service/UserService';
import DashboardLayout from '../../../templates/DashboardLayout'
import { http_client } from '../../../utils/axios-custum';

type TypeAddCustomer = {}

const CREATE_CUSTOMERS_URL = '/customers';

const AddCustomer:FC<TypeAddCustomer> = () => {

  const [sending, setSending] = useState(false);
  const [errForm, setErrForm] = useState('');
  const [success,setSuccess]  = useState(false)
  const [customer,setCustomer] = useState<Customer>({});
  

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

    setCustomer({...customer,company_id: UserService.getUser().company_id || 1})    

    e.preventDefault();
    setSending(true);
    setErrForm('')
    http_client(Storage.getStorage('auth').token).post(CREATE_CUSTOMERS_URL,customer)
      .then(res => {
        setSending(false);
        toast.success(res.data.message)
        console.log(res.data);
        
        setSuccess(true);
      })
      .catch(err => {
        setSending(false);
        setErrForm(err.response.data.message)
        console.log(err);
      });
  }

  return (
    <DashboardLayout
      titleClass="w-[30%]"
      title='Customer management'
      headerContent={
        <>
          <div className="ml-4 w-[68%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
            <span>|  <span className='ml-2'>add a new customer</span></span>{" "}
          </div>
        </>
      }
    >
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {success &&
            <div className="p-5 max-w-4xl flex justify-between items-start  mx-auto rounded-lg text-center bg-green-50 border-green-400 border-4 text-green-400 font-bold text-3xl relative">
              <span className='flex items-start justify-start flex-col'>
                <span className='flex items-start justify-start'><FaCheckCircle className='mr-2' /> <span>Your customer has been successfully created! </span></span>
                <span className='text-sm italic text-gray-500 '>An email containing his login information has been sent to your customer ! </span>
              </span> 
              <Link to='/customers' className='px-4 items-center justify-center py-2 bg-[#ac3265] transition hover:bg-[#8a2a52] active:scale-[96%] text-white rounded-md text-base inline-block ml-4'>List of customer</Link>
            </div>
          }

        {!success && 
          <form onSubmit={handleSubmit} className="p-5 max-w-4xl mx-auto rounded-lg  bg-white relative">
            <Link to='/customers' className='text-3xl inline-block text-[#ac3265] hover:text-gray-700'>
              <HiOutlineArrowNarrowLeft />
            </Link>

            {errForm && <div className="px-3 py-1 rounded-md mb-2 text-center text-sm font-bold text-red-500 bg-red-100">{errForm}</div>}

            <div className="flex justify-between items-start space-x-4 mb-4">
              <div className=' flex-col flex w-1/2'>
                <label htmlFor="firstname">Client's first name</label>
                <input autoFocus required onChange={handleOnchange} name='firstname' value={customer.firstname || ''} type="text" placeholder='Enter your first name' className='px-3 mt-2 rounded-md border-none focus:ring-2 ring-gray-700 focus:ring-gray-700 py-2 bg-gray-100 w-full' />
              </div>
              <div className=' flex-col flex w-1/2'>
                <label htmlFor="lastname">Client's last name</label>
                <input required onChange={handleOnchange} name='lastname' value={customer.lastname || ''} type="text" placeholder='Enter your last name' className='px-3 mt-2 rounded-md border-none focus:ring-2 ring-gray-700 focus:ring-gray-700 py-2 bg-gray-100 w-full' />
              </div>
            </div>

            <div className="flex justify-between items-start space-x-4 mb-4">
              <div className=' flex-col flex w-1/2'>
                <label htmlFor="email">Email <span className='text-sm italic text-gray-400'>( optional )</span></label>
                <input onChange={handleOnchange} name='email' value={customer.email || ''} type="email" placeholder="Enter your customer's email" className='px-3 mt-2 rounded-md border-none focus:ring-2 ring-gray-700 focus:ring-gray-700 py-2 bg-gray-100 w-full' />
              </div>
              <div className=' flex-col flex w-1/2'>
                <label htmlFor="tel">Phone number <span className='text-sm italic text-gray-400'>( optional )</span></label>
                <input onChange={handleOnchange} name='tel' value={customer.tel || ''} type="tel" placeholder='Enter the phone number of your customer' className='px-3 mt-2 rounded-md border-none focus:ring-2 ring-gray-700 focus:ring-gray-700 py-2 bg-gray-100 w-full' />
              </div>
            </div>

            <div className="flex justify-between items-start space-x-4 mb-4">
              <div className=' flex-col flex w-full'>
                <label htmlFor="address">Address <span className='text-sm italic text-gray-400'>( optional )</span></label>
                <input onChange={handleOnchange} name='address' value={customer.address || ''} type="address" placeholder="Enter the customer's address" className='px-3 mt-2 rounded-md border-none focus:ring-2 ring-gray-700 focus:ring-gray-700 py-2 bg-gray-100 w-full' />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button type='submit' className={`px-4 ${sending && 'disabled'} flex justify-center items-center py-[0.48rem] bg-[#ac3265] hover:bg-[#951f50] transition min-w-[200px] text-white text-sm font-semibold rounded-md`}>
                {sending ? <Loader className=' inline-block text-xl' /> : 'Register new customer'}
              </button>
            </div>

          </form>
        }

        </div>
      </div>

    </DashboardLayout>
  )
}

export default AddCustomer