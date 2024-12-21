![image](https://github.com/user-attachments/assets/a5de9682-a29e-433c-b654-853a1f55c16f)

# NoteSols - Decentralized Note Taker
### Store you notes on chain! Take the first step towards a decentralized world.
### NoteSols is a decentralized note taker that allows users to create, read, update, and delete notes. It is built using the Anchor framework and the Solana blockchain Devnet.

## NoteSols Program Address - DEVNET

https://explorer.solana.com/address/7MZAQw52ZgKMzVhE8VZdZCxxcR9XQfdCcmQSEmu93xjh?cluster=devnet

## Frontend Deployed: https://notesols-dapp.vercel.app/notesols

## Project Setup

### Environment Setup

For this Task you need:

- [Rust installed](https://www.rust-lang.org/tools/install)
  - Make sure to use stable version:
  ```bash
  rustup default stable
  ```
- [Solana installed](https://docs.solana.com/cli/install-solana-cli-tools)

  - Use v1.18.18
  - After you have Solana-CLI installed, you can switch between versions using:

  ```bash
  solana-install init 1.18.18
  ```

- [Anchor installed](https://www.anchor-lang.com/docs/installation)

  - Use v0.30.1
  - After you have Anchor installed, you can switch between versions using:

  ```bash
  avm use 0.30.1
  ```

  <br>
  <br>
  <br>

### 01. Anchor Program with Tests

1. Clone the repository:

```bash
git clone https://github.com/AhindraD/notesols
```

2. Change directory to the notesols folder of the cloned repository:

```bash
cd notesols
```

3. Install dependencies:

```bash
npm install
```

4. Change directory to the anchor folder:

```bash
cd anchor
```

5. Build the program:

```bash
anchor build
```

6. Test the program:

```bash
 anchor test
```

  <br>
  <br>
  <br>

### 02. Web App - Frontend

1. Go to the deployed frontend at https://notesols-dapp.vercel.app/notesols

Or,

2. Run the development server at root directory:

```bash
npm run dev
```

5. Open http://localhost:3000/notesols in your browser to see the result, and ineteract with the program.
