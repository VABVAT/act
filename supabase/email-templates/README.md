# Supabase Email Template Setup

Use the files in this folder to update the hosted Supabase email templates for Arteez Collection.

## Confirm Sign Up

1. Open the Supabase Dashboard.
2. Go to `Authentication` -> `Email Templates`.
3. Open `Confirm signup`.
4. Set the email subject to:

   ```text
   Confirm your Arteez Collection account
   ```

5. Paste the contents of [`confirm-signup.html`](/Users/sid/Webstorm/ac/supabase/email-templates/confirm-signup.html) into the template editor.

## URL Configuration

In the Supabase Dashboard, also update `Authentication` -> `URL Configuration`:

- Site URL: `https://arteezcollection.in`
- Additional Redirect URLs:
  - `https://arteezcollection.in/auth/confirm`
  - `http://localhost:3000/auth/confirm`

This keeps signup confirmation and password reset links aligned with the live domain while still allowing local development.
