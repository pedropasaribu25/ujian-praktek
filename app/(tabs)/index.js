import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Keyboard,
  Alert
} from 'react-native';

export default function App() {
  const [transaksi, setTransaksi] = useState([]);
  const [nama, setNama] = useState('');
  const [nominal, setNominal] = useState('');

  // Hitung Saldo Secara Real-Time
  const totalPemasukan = transaksi
    .filter(item => item.tipe === 'masuk')
    .reduce((sum, item) => sum + item.nominal, 0);

  const totalPengeluaran = transaksi
    .filter(item => item.tipe === 'keluar')
    .reduce((sum, item) => sum + item.nominal, 0);

  const totalSaldo = totalPemasukan - totalPengeluaran;

  // Fungsi Tambah Transaksi
  const tambahTransaksi = (tipe) => {
    if (!nama.trim() || !nominal.trim()) {
      Alert.alert('Error', 'Nama transaksi dan nominal wajib diisi!');
      return;
    }

    const nilaiNominal = parseInt(nominal, 10);
    if (isNaN(nilaiNominal) || nilaiNominal <= 0) {
      Alert.alert('Error', 'Nominal harus berupa angka lebih dari 0!');
      return;
    }

    const dataBaru = {
      id: Date.now().toString(),
      ket: nama,
      nominal: nilaiNominal,
      tipe: tipe // 'masuk' atau 'keluar'
    };

    setTransaksi([dataBaru, ...transaksi]);
    setNama('');
    setNominal('');
    Keyboard.dismiss();
  };

  // Komponen Render Item FlatList
  const renderItem = ({ item }) => {
    const isMasuk = item.tipe === 'masuk';
    return (
      <View style={styles.cardItem}>
        <Text style={styles.textKet}>{item.ket}</Text>
        <Text style={[styles.textNominal, { color: isMasuk ? '#2e7d32' : '#c62828' }]}>
          {isMasuk ? '+' : '-'} Rp {item.nominal.toLocaleString('id-ID')}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Dashboard Saldo */}
      <View style={styles.dashboard}>
        <Text style={styles.labelSaldo}>Total Saldo Anda</Text>
        <Text style={[styles.valueSaldo, { color: totalSaldo >= 0 ? '#2e7d32' : '#c62828' }]}>
          Rp {totalSaldo.toLocaleString('id-ID')}
        </Text>
      </View>

      {/* Input Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nama Transaksi (e.g., Beli Kopi)"
          placeholderTextColor="#999"
          value={nama}
          onChangeText={setNama}
        />
        <TextInput
          style={styles.input}
          placeholder="Nominal (e.g., 20000)"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={nominal}
          onChangeText={setNominal}
        />
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.btnMasuk]}
            onPress={() => tambahTransaksi('masuk')}
          >
            <Text style={styles.btnText}>Pemasukan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.btnKeluar]}
            onPress={() => tambahTransaksi('keluar')}
          >
            <Text style={styles.btnText}>Pengeluaran</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Interactive List */}
      <View style={styles.listContainer}>
        <Text style={styles.titleList}>Riwayat Transaksi</Text>
        <FlatList
          data={transaksi}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <View style={styles.emptyView}>
              <Text style={styles.emptyText}>Belum ada transaksi, Bro!</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  dashboard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  labelSaldo: {
    fontSize: 14,
    color: '#666',
    fontWeight: '6xlarge',
    marginBottom: 4,
  },
  valueSaldo: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnMasuk: {
    backgroundColor: '#2e7d32',
    marginRight: 8,
  },
  btnKeluar: {
    backgroundColor: '#c62828',
    marginLeft: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 20,
  },
  titleList: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  cardItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 1,
  },
  textKet: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  textNominal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
});
