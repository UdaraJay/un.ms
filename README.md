<br></br>

<p align="center">
  <a href="https://un.ms"><img align="center" src="/public/unms-color.png" height="80px"/></a>
</p>
<p align="center">
  <a href="https://un.ms">un.ms</a> is a simple tool for taking notes <br/> and logging activity across all your devices.
</p><br></br>

#### FEATURES

- Client-side encryption with two keys (the user's data never leaves their device unencrypted.)
- Minimal UI for writing, reading and sharing notes and logs
- PWA you can install on desktop and mobile
- Markdown import/export

> I took to building this in public because it's a passion-project, and whilst others are welcomed to fork or use this code in their own products, development decisions are centered around un.ms and some of my needs. However, I'm always open to productive suggestions and changes in the form of issues and pull requests.

- Learn how client-side encryption is implemented on un.ms
- Contribute features or suggest changes you want to see on un.ms
- Clone it, learn from it, build your own

#### CLIENT-SIDE ENCRYPTION STRATEGY

If you're learning about client-side encryption, I highly recommend reading about [1Password's security design](https://1password.com/files/1Password-White-Paper.pdf). it's a chock-full of most things you need to know to get started. In fact, this was inspired by 1Password's
design. We don't (and can't) do a bunch of the things they do, but it's a great reference for what we're doing here...

0. Generate a salt => salt1 ↖︎ (use the user email to derive it)
1. Generate an encryption key => keyE (used to encrypt user data)

2. Generate a secret key => key2a
3. Use password -> string.normalize('NFKD') -> pbkdf2() => key1
4. Use key + key2a to generate an encrypton key => MUK (Master unlock key)
5. Use MUK to encrypt keyE => eKeyE ↖︎

↖︎ means stored on server, everything else is stored only on the client.

#### SECURITY VULNERABILITIES

If you discover a security vulnerability within this project, please send an e-mail to Udara via me@udara.io. All security vulnerabilities will be promptly addressed.
