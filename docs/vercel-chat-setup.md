# Connect the portfolio chat on Vercel

The chat already uses Groq with **`openai/gpt-oss-120b`**. You only need to add your **Groq API key** to Vercel; an OpenAI API key is not needed. The model ID is already configured in `lib/chat-server.ts`. [Groq model documentation](https://console.groq.com/docs/model/openai/gpt-oss-120b).

## If your portfolio is already on Vercel

1. Make sure the latest portfolio changes are pushed to the branch Vercel deploys for production.
2. Have your Groq API key ready. You can manage or create keys in the [Groq console](https://console.groq.com/keys).
3. Open your [Vercel dashboard](https://vercel.com/dashboard), select the correct account/team, and open your portfolio project.
4. Open **Environment Variables** in the project sidebar. If your dashboard groups it under **Settings**, use **Settings → Environment Variables**. This is the project setting, not a team-wide variable. [Vercel environment-variable instructions](https://vercel.com/docs/environment-variables/managing-environment-variables).
5. Add this variable:

   | Field | What to enter |
   | --- | --- |
   | Name / Key | `GROQ_API_KEY` |
   | Value | Your actual Groq API key, without surrounding quotes |
   | Environments | **Production**; also select **Preview** if you want preview deployments to chat |

   Paste only the key into Value, without `GROQ_API_KEY=` or `Bearer `. Keep the name exactly as shown; do not add `NEXT_PUBLIC_`.
6. Click **Save**. If `GROQ_API_KEY` already exists, edit its value and environment selection instead of adding a duplicate.
7. Open **Deployments**, find your latest **Production** deployment, choose its **… → Redeploy** action, and confirm **Redeploy**. Choose a deployment containing the current chat code. [Vercel redeployment instructions](https://vercel.com/docs/deployments/managing-deployments#redeploy-a-project).
8. Wait for the new deployment to become **Ready**, then open your production domain. Click the sprite and send **“What does Reggie build?”**. You should receive a real reply. Switch the Zelda theme on and try another question to check the Wayfinder personality too.

Saving a variable does **not** update an existing deployment. A new deployment must pick it up; refreshing an old deployment URL is not enough. [Vercel explains when environment changes take effect](https://vercel.com/docs/environment-variables/managing-environment-variables).

## If you have not created the Vercel project yet

1. Push the current portfolio to your Git repository.
2. Open [New Project on Vercel](https://vercel.com/new), connect your Git provider if needed, and select the portfolio repository.
3. Use the **Next.js** framework preset. Set the root directory to the repository folder containing this project's `package.json` and `app/` directory.
4. Before deploying, expand **Environment Variables** and add `GROQ_API_KEY` with your actual key as described above.
5. Click **Deploy**. When it is ready, open the site and test the chat. Verify the variable applies to **Production** in the project environment settings. If you add or change it after deployment, redeploy using the steps above.

Vercel supports configuring the framework, root directory, and environment variables before the first deployment. [Official Git import instructions](https://vercel.com/docs/git#deploying-a-git-repository).

## If the chat does not reply

| What you see | What to check |
| --- | --- |
| “The chat is not connected yet” — HTTP 503 | `GROQ_API_KEY` is missing or empty in that deployment. Check its exact name, select Production, save, and redeploy. Preview URLs need the Preview environment selected too. |
| “The chat connection needs attention” — HTTP 503 | Groq returned an authentication or permissions error. A Groq **401** means the credentials are invalid; **403** means access is restricted. Check the key, remove accidental quotes/prefixes, verify Groq model access, update the Vercel value, and redeploy. The app intentionally converts both upstream errors to a safe 503 message. |
| A limit or busy message — HTTP 429 | Wait at least a minute before trying again. The app and Groq both impose limits; repeated errors may require checking your Groq account's usage and limits. |

The messages above match this app's API handler. [Groq's error-code reference](https://console.groq.com/docs/errors) explains upstream authentication, permission, and rate-limit errors.

Your local `.env.local` is ignored by Git and does not automatically configure Vercel. Enter the value in Vercel separately. Keep the real key out of source code and browser components; `GROQ_API_KEY` is read only by the server route. You do not need another package, an OpenAI key, or a model-setting change.
