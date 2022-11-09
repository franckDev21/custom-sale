import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'
import React, { useEffect, useState } from 'react'
import Company from '../../Model/Company'
import DefaultImage from '../../assets/img/logo/logo3.png'
import { http_client } from '../../utils/axios-custum'
import Storage from '../../service/Storage'

type NewHeaderInvoiceProps = {
}

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection:'column',
    fontSize: 13,
    padding: 8
  },
  header: {
    padding: 8,
    display: 'flex',
    justifyContent : 'space-between',
    flexDirection: 'row',
    marginBottom: 10
  },
  title : {
    fontSize: 20,
    fontWeight: 'extrabold'
  },
  text : {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 7
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems : 'flex-start'
  }
});

const GET_COMPANY_URL = 'my/company'

const NewHeaderInvoice:React.FC<NewHeaderInvoiceProps> = () => {

  const [company,setCompany] = useState<Company>({})

  useEffect(() => {
    http_client(Storage.getStorage("auth").token).get(`${GET_COMPANY_URL}`)
      .then(res => {
        setCompany(res.data)
      })
      .catch(err => {
        console.log(err);
      })
  },[])

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>{company.name}</Text>
      </View>
      <View style={styles.right} >
        <Text style={styles.text}>Email :{company.email}</Text>
        <Text style={styles.text}>Tél :{company.tel}</Text>
        <Text style={styles.text}>NUI :{company.RCCM}</Text>
        <Text style={styles.text}>RCCM :{company.RCCM}</Text>
        <Text style={styles.text}>Localisation :{company.address}</Text>
      </View>
    </View>
  )
}

export default NewHeaderInvoice