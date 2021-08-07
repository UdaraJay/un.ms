<img src="/public/unms.svg" height="80px">

### un.ms

[un.ms](https://un.ms) is a simple tool for taking notes and and synchroning them across devices.

### Features

- Client-side encryption with two keys (the user's data never leaves their device unencrypted.)
- Minimal UI for writing, reading and sharing notes and logs
- Markdown import/export

> I took to building this in public because it's a passion-project, and whilst others are welcome to fork or use this code in their own products, development decisions are centered around un.ms.

### This repo is public to...

- Share how to build a client-side encryption implementation.
- Letting the public contribute to un.ms. If you want to get involved, I'm happy to consider PRs and work together. Please create issues with your ideas first though.
- Clone it to build your own.

### Client-side encryption strategy

If you're learning about client-side encryption, I highly recommend reading about [1Password's security design](https://1password.com/files/1Password-White-Paper.pdf). it's a chock-full of most things you need to know to get started. In fact, this was inspired by 1Password's
design. We don't (and can't) do a bunch of the things they do, but it's a great reference for what we're doing here...

0. Generate a salt => salt1 ↖︎ (use the user email to derive it)
1. Generate an encryption key => keyE (used to encrypt user data)
2. Generate a secret key => key2a
3. Use password -> string.normalize('NFKD') -> pbkdf2() => key1
4. Use key + key2a to generate an encrypton key => MUK (Master unlock key)
5. Use MUK to encrypt keyE => eKeyE ↖︎

↖︎ means stored on server, everything else is stored only on the client.
