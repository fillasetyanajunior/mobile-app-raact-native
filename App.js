import { useEffect, useState } from 'react';
import { Button, ScrollView, SectionList, StyleSheet, Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

export default function App() {
    let url             = 'https://192.1168.18.22/test-developer/'
    let enpointPayment  = 'api/payment'
    let name            = 'Alfandy'
    const month         = ["3", "6", "9", "12"]
    const methods       = ["Bank", "VA", "Lainnya"]
    const [payment, SetPayment] = useState()
    const [sale, SetSale] = useState()
    const [form, SetForm] = useState()
    const [button, SetButton] = useState('')
    const bulan = ['Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Agu',
        'Sep',
        'Okt',
        'Nov',
        'Des'
    ]

    const data = async () => {
        const response = await fetch(url + enpointPayment + '?name=' + name);
        const json = await response.json();
        SetSale(json.sale)
        SetPayment(json.payment)
    }

    useEffect(() => {
        data()
    },[])

    const submitAjukan = async () => {
        const response = await fetch(url + enpointPayment, {
            method: 'POST',
            body: form
        });
        const json = await response.json();
        if (json) {
            data()
        }
    }

    const submitPayment = async (values) => {
        const response = await fetch(url + enpointPayment + '/store/' + values.payment_number, {
            method: 'POST',
        });
        const json = await response.json();
        if (json) {
            data()
        }
    }

    function formatRupiah(angka, prefix) {
        var number_string = angka.replace(/[^,\d]/g, '').toString(),
            split = number_string.split(','),
            sisa = split[0].length % 3,
            rupiah = split[0].substr(0, sisa),
            ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        // tambahkan titik jika yang di input sudah menjadi angka ribuan
        if (ribuan) {
            separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
        return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
    }

    return (
        <View style={styles.container}>
            <View style={{alignItems: 'flex-start', width:'100%'}}>
                <Text style={[styles.fontMedium]}>Kreditku</Text>
            </View>
            <View style={styles.card}>
                <Text style={[styles.textWhite,styles.fontMedium]}>{name}</Text>
                <Text style={[styles.textWhite,styles.fontLarge]}>{sale}</Text>
            </View>
            <View style={{width: '100%'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                    <SelectDropdown
                        defaultButtonText='Bulan'
                        data={month}
                        onSelect={(selectedItem, index) => {
                            if (form.month != '' && form.metode_payment != '') {
                                SetButton(true)
                            }else{
                                SetButton(true)
                            }
                            SetForm({...form, name:name, month: selectedItem})
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem
                            }}
                            rowTextForSelection={(item, index) => {
                                return item
                            }}
                    />
                    <SelectDropdown
                        defaultButtonText='Metode Pambayaran'
                        data={methods}
                        onSelect={(selectedItem, index) => {
                            if (form.month != '' && form.metode_payment != '') {
                                SetButton(true)
                            } else {
                                SetButton(true)
                            }
                            SetForm({...form, metode_payment: selectedItem})
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            return item
                        }}
                    />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%', marginTop:10}}>
                    <Button onPress={() => submitAjukan()} style={{marginVertical:10}} title='Ajukan' {...button}/>
                </View>
            </View>
            <ScrollView style={{width: '100%'}}>
                {
                    payment?.map((payment) => {
                        <View style={[styles.cardComponent]}>
                            <View style={styles.justifyContentCenter}>
                                <Text style={[styles.fontMedium]}>{bulan[new Date(payment.date_payment).getMonth()]}</Text>
                                <Text style={[styles.fontSmall]}>Tanggal jatuh tempo {payment.date_payment}</Text>
                            </View>
                            <View style={[styles.justifyContentCenter]}>
                                <Text style={[styles.fontSmall]}>{formatRupiah(payment.total.payment)}</Text>
                                <Button onPress={() => submitPayment()} style={{marginVertical:10}} title='Bayar'/>
                            </View>
                        </View>
                    })
                }
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 'auto',
        width: 'auto',
    },
    card:{
        backgroundColor: '#A9A9A9',
        width:'100%',
        height: 150,
        borderRadius: 10,
        padding: 10,
        margin: 20,
    },
    cardComponent:{
        backgroundColor: '#FFFFFF',
        shadowColor: '#888888',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
        height: 80,
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 5,
        justifyContent:'space-between',
        display:'flex',
        flexDirection:'row',
    },
    justifyContentCenter:{
        justifyContent:'center',
    },
    textWhite:{
        color: '#FFFFFF',
    },
    fontLarge:{
        fontSize: 30,
        fontWeight: "bold",
    },
    fontMedium:{
        fontSize: 20,
        fontWeight: "bold",
    },
    fontSmall:{
        fontSize: 15,
        fontWeight: "bold",
    },
});
