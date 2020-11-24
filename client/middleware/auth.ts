export default function ({ redirect, store }) {
  if (!store.$cookies.get('fibreux')) {
    return redirect('/login')
  }
}
