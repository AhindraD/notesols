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
import { title } from 'process'

interface CreateEntryArgs {
  title: string,
  message: string,
  owner: PublicKey,
}

export function useNotesolsProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getNotesolsProgramId(cluster.network as Cluster), [cluster])
  const program = getNotesolsProgram(provider)

  const accounts = useQuery({
    queryKey: ['notesols', 'all', { cluster }],
    queryFn: () => program.account.noteEntryState.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const createEntry = useMutation<String, Error, CreateEntryArgs>({
    mutationKey: ["notesols", "create", { cluster }],
    mutationFn: async ({ title, message }) => {
      return program.methods.createNoteEntry(title, message).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(`${signature}`)
      accounts.refetch()
    },
    onError: (error) => {
      toast.error(`FAILED to create note: ${error.message}`)
    }
  })


  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createEntry,
  }
}

export function useNotesolsProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useNotesolsProgram()

  const accountQuery = useQuery({
    queryKey: ['notesols', 'fetch', { cluster, account }],
    queryFn: () => program.account.noteEntryState.fetch(account),
  })

  const updateEntry = useMutation<String, Error, CreateEntryArgs>({
    mutationKey: ["notesols", "update", { cluster }],
    mutationFn: async ({ title, message }) => {
      return program.methods.updateNoteEntry(title, message).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(`${signature}`)
      accounts.refetch()
    },

    onError: (error) => {
      toast.error(`FAILED to update note: ${error.message}`)
    }
  })

  const deleteEntry = useMutation({
    mutationKey: ["notesols", "delete", { cluster }],
    mutationFn: async (title: string) => {
      return program.methods.deleteNoteEntry(title).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      accounts.refetch()
    },
    onError: (error) => {
      toast.error(`FAILED to delete note: ${error.message}`)
    }
  })


  return {
    accountQuery,
    updateEntry,
    deleteEntry,
  }
}