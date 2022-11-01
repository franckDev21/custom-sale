import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'
import React, { useEffect, useState } from 'react'
import Company from '../../Model/Company'
import DefaultImage from '../../assets/img/logo/logo3.png'
import { http_client } from '../../utils/axios-custum'
import Storage from '../../service/Storage'
import UserService from '../../service/UserService'

type HeaderInvoiceProps = {
}

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection:'column',
    fontSize: 13
  },
  header: {
    padding: 8,
    display: 'flex',
    justifyContent : 'space-between',
    flexDirection: 'row',
  },
  image : {
    width : 130,
    height : 130,
    // backgroundColor: "#E4E4E4",
  },
  right : {
    width: '80%',
    // backgroundColor : 'green',
    height : 130,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    textAlign: 'center'
  },
  rightBottom : {
    marginBottom: 10,
    textAlign: 'center',
    padding: 5
  },
  head : {
    // backgroundColor: 'yellow',
    width: '100%',
    display: 'flex',
    padding: 8
  },
  content : {
    maxWidth: 200,
    width: '100%',
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    // backgroundColor: 'pink'
  },
  date : {
    width: '100%'
  },
  customer : {
    width: '100%',
    maxWidth: 200,
    // backgroundColor : 'red',
    minHeight: 50,
    border: 1,
    marginTop: 5
  },
  tableTile : {
    width: '100%',
    maxWidth: 500,
    // backgroundColor: 'violet',
    minHeight: 15,
    marginTop: 4,
    textDecoration: 'underline',
    fontSize: 14,
  },
  tableTh:{
    fontWeight: 'semibold',
    width: '14.12%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    borderTop: 1,
    minHeight: 30
  },
  tableThLast:{
    fontWeight: 'semibold',
    width: '14.12%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    borderTop: 1,
    minHeight: 30,
    borderRight: 1
  },
  tableThFirst:{
    fontWeight: 'semibold',
    width: '14.12%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    borderTop: 1,
    minHeight: 30,
    borderLeftWidth: 1,
    borderLeftColor: '#000',
  },
  tableChild:{
    width: '14.12%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    minHeight: 30,
  },
  tableChildRigth:{
    width: '14.12%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    minHeight: 30,
    borderRight: 1
  },
  tableTotal: {
    width: '25%',
    padding: 4,
    minHeight: 30,
    borderBottom: 1
  },
  table : {
    display:'flex',
    flexWrap: 'wrap',
    width: '100%',
    flexDirection: 'row',
    fontSize: '11px',
    marginLeft: 3,
  },
  signature : {
    paddingTop: 8,
    paddingRight: 30,
    width: '100%',
    minHeight: 20,
    marginTop: 70,
    display: 'flex',
    textDecoration: 'underline',
    marginLeft: 'auto',
    marginRight: 'auto',
  }
});

const GET_COMPANY_URL = 'my/company'

const HeaderInvoice:React.FC<HeaderInvoiceProps> = () => {

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
      <View style={styles.image}>
        <Image src={company.photo ? company.photo : DefaultImage} />
      </View>
      <View style={styles.right}>
        <View style={styles.rightBottom}><Text style={{ padding:4, marginLeft: 5 }}>{company.name}</Text></View>
        <View style={styles.rightBottom}><Text style={{ padding:4, marginLeft: 5 }}>Commerce Général - Prestations de Services</Text></View>
        {/* <View style={styles.rightBottom}><Text style={{ padding:4, marginLeft: 5 }}>B.P : 7754 Douala Tél : (237) 243 043 918 / 696 975 548</Text></View> */}
        {/* <View style={styles.rightBottom}><Text>Site internet : https://solumat-sarl.com/</Text></View> */}
      </View>
    </View>
  )
}

export default HeaderInvoice