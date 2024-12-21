'use client'

import { Keypair, PublicKey } from '@solana/web3.js'
import { useMemo, useState } from 'react'
import { ellipsify } from '../ui/ui-layout'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useNotesolsProgram, useNotesolsProgramAccount } from './notesols-data-access'
import { initialize } from 'next/dist/server/lib/render-server'
import { useWallet } from '@solana/wallet-adapter-react'

export function NotesolsCreate() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const { createEntry } = useNotesolsProgram();
  const { publicKey } = useWallet();

  let isFormValid = title.trim() !== '' && message.trim() !== '';

  const handleSubmit = function () {
    if (isFormValid && publicKey) {
      createEntry.mutateAsync({ title, message, owner: publicKey });
      setTitle('');
      setMessage('');
    }
  }

  if (!publicKey) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Connect your wallet to create a note!</span>
      </div>
    )
  }
  return (
    <div className='flex flex-col gap-4 items-center'>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input input-bordered w-full max-w-xs" />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="textarea textarea-bordered w-full max-w-xs" />
      <button
        onClick={handleSubmit}
        disabled={!isFormValid || createEntry.isPending}
        className="btn btn-primary"
      >
        Create Note {createEntry.isPending && <span className="loading loading-spinner"></span>}
      </button>
    </div>
  )
}

export function NotesolsList() {
  const { accounts, getProgramAccount } = useNotesolsProgram()

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <NotesolsCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  )
}

function NotesolsCard({ account }: { account: PublicKey }) {
  const { accountQuery, updateEntry, deleteEntry } = useNotesolsProgramAccount({
    account,
  })
  const { publicKey } = useWallet();
  const [message, setMessage] = useState('');
  const title = accountQuery.data?.title;//cannot mutate as it;s used as seed for PDA
  let isFormValid = message.trim() !== '';
  const handleSubmit = async function () {
    if (isFormValid && publicKey && title) {
      await updateEntry.mutateAsync({ title, message, owner: publicKey });
      setMessage('');
    }
    await accountQuery.refetch()
  }

  if (!publicKey) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Connect your wallet to update the note!</span>
      </div>
    )
  }

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content background-gradient-notesols bg-slate-900">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2
            className="card-title justify-center text-3xl cursor-pointer"
            onClick={() => accountQuery.refetch()}
          >
            {accountQuery.data?.title}
          </h2>
          <p>{accountQuery.data?.message}</p>
          <div className="card-actions justify-around">
            <textarea
              placeholder="Update note message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="textarea textarea-bordered w-full max-w-xs"
            />
            <button
              className="btn btn-xs lg:btn-md btn-primary"
              onClick={handleSubmit}
              disabled={updateEntry.isPending || !isFormValid}
            >
              Update Note {updateEntry.isPending && "..."}
            </button>
          </div>
          <div className="text-center space-y-4">
            <p>
              <ExplorerLink
                path={`account/${account}`}
                label={ellipsify(account.toString())}
              />
            </p>
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={() => {
                if (
                  !window.confirm(
                    "Are you sure you want to delete this note?"
                  )
                ) {
                  return;
                }
                const title = accountQuery.data?.title;
                if (title) {
                  return deleteEntry.mutateAsync(title);
                }
              }}
              disabled={deleteEntry.isPending}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}