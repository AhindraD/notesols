'use client'

import { getNotesolsProgram, getNotesolsProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useNotesolsProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getNotesolsProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getNotesolsProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['notesols', 'all', { cluster }],
    queryFn: () => program.account.notesols.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['notesols', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ notesols: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useNotesolsProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useNotesolsProgram()

  const accountQuery = useQuery({
    queryKey: ['notesols', 'fetch', { cluster, account }],
    queryFn: () => program.account.notesols.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['notesols', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ notesols: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['notesols', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ notesols: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['notesols', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ notesols: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['notesols', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ notesols: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
