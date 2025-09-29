import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import abi from 'contracts-abi/PointsToken.json'

const CONTRACT = import.meta.env.VITE_CONTRACT_ADDRESS || ''

export default function App(){
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState('0')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{},[])

  async function connect(){
    if(!window.ethereum) return alert('Instala MetaMask')
    try{
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(accounts[0])
      await refreshBalance(accounts[0])
    }catch(e){ console.error(e) }
  }

  async function refreshBalance(addr){
    try{
      const res = await fetch(`http://localhost:3001/balance/${addr}`)
      const data = await res.json()
      if(res.ok) setBalance(data.balance)
      else console.error('backend error', data)
    }catch(e){ console.error(e) }
  }

  async function requestPoints(){
    if(!account) return alert('Conecta tu wallet')
    setLoading(true)
    try{
      const res = await fetch('http://localhost:3001/mint',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ user: account, amount: 1 })
      })
      const text = await res.text()
      try {
        const data = JSON.parse(text)
        if(!res.ok) alert('Error: '+data.error)
        else {
          alert(`Tx: ${data.tx}\nNuevo balance: ${data.new_balance}`)
          setBalance(data.new_balance)
        }
      } catch(e) {
        console.error('Error parsing JSON', text)
        alert('Error: '+text)
      }
    }catch(e){ console.error(e); alert('Error en request') }
    finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900">
      <div 
        className="w-full max-w-md bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-slate-700"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-sky-400">Puntos — Demo</h1>
        
        <div className="mb-6">
          {!account ? (
            <button 
              onClick={connect} 
              className="w-full py-3 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors duration-300"
            >
              Conectar Wallet
            </button>
          ) : (
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
              <div className="text-sm text-slate-400">Cuenta</div>
              <div className="font-mono break-all text-slate-300 mt-1">{account}</div>
            </div>
          )}
        </div>

        <div className="mb-6 p-6 bg-slate-900/50 rounded-lg text-center border border-slate-700">
          <div className="text-sm text-slate-400">Puntos</div>
          <div className="text-5xl font-bold text-sky-400 tracking-tight">{balance}</div>
        </div>

        <button 
          onClick={requestPoints} 
          disabled={loading || !account} 
          className="w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors duration-300 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </>
          ) : 'Pedir 1 punto'}
        </button>
      </div>
    </div>
  )
}
