import { useEffect, useState, type FormEvent } from 'react'
import { fetchCategories, type Category } from '../lib/api'
import { cn } from '../lib/cn'
import { formatRand } from '../lib/format'
import { supabase } from '../lib/supabase'
import Button from './Button'
import Input from './Input'

type ServiceRow = {
  id: string
  name: string
  starting_price: number | string | null
  active: boolean
  categories: { name: string } | null
}

// Lets a provider add, pause and remove the services shown on their public profile.
export default function ManageServices({ providerId }: { providerId: string }) {
  const [services, setServices] = useState<ServiceRow[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [reloadKey, setReloadKey] = useState(0)
  const [form, setForm] = useState({ categoryId: '', name: '', price: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchCategories()
      .then((data) => {
        if (!cancelled) setCategories(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load categories.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    supabase
      .from('services')
      .select('id, name, starting_price, active, categories(name)')
      .eq('provider_id', providerId)
      .order('name')
      .then(({ data, error: queryError }) => {
        if (cancelled) return
        if (queryError) setError('Could not load your services.')
        else setServices((data ?? []) as unknown as ServiceRow[])
      })
    return () => {
      cancelled = true
    }
  }, [providerId, reloadKey])

  const reload = () => setReloadKey((key) => key + 1)

  const handleAdd = async (event: FormEvent) => {
    event.preventDefault()
    const price = form.price.trim() === '' ? null : Number(form.price)
    if (!form.categoryId || form.name.trim().length < 3) {
      setError('Choose a category and enter a service name.')
      return
    }
    if (price !== null && (Number.isNaN(price) || price < 0)) {
      setError('Enter a valid starting price in Rand, or leave it empty.')
      return
    }
    setError('')
    setSaving(true)
    const { error: insertError } = await supabase.from('services').insert({
      provider_id: providerId,
      category_id: Number(form.categoryId),
      name: form.name.trim(),
      starting_price: price,
    })
    setSaving(false)
    if (insertError) {
      setError('Could not add the service.')
      return
    }
    setForm({ categoryId: form.categoryId, name: '', price: '' })
    reload()
  }

  const toggleActive = async (service: ServiceRow) => {
    const { error: updateError } = await supabase.from('services').update({ active: !service.active }).eq('id', service.id)
    if (updateError) setError('Could not update the service.')
    else reload()
  }

  const remove = async (service: ServiceRow) => {
    const { error: deleteError } = await supabase.from('services').delete().eq('id', service.id)
    if (deleteError) setError('Could not remove the service.')
    else reload()
  }

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg">Manage services</h2>
      <p className="mt-1 text-sm text-slate-500">These appear on your public profile with their starting prices.</p>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {services.length > 0 && (
        <ul className="mt-4 divide-y divide-slate-100">
          {services.map((service) => (
            <li key={service.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className={cn(!service.active && 'opacity-50')}>
                <p className="font-medium text-primary-dark">{service.name}</p>
                <p className="text-sm text-slate-500">
                  {service.categories?.name}
                  {' · '}
                  {service.starting_price !== null ? `From ${formatRand(Number(service.starting_price))}` : 'Price on request'}
                  {!service.active && ' · Hidden'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => toggleActive(service)}>
                  {service.active ? 'Hide' : 'Show'}
                </Button>
                <button type="button" onClick={() => remove(service)} className="px-2 text-sm font-medium text-danger hover:underline">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="mt-5 grid gap-3 sm:grid-cols-[180px_1fr_140px_auto] sm:items-end">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="service-category" className="text-sm font-medium text-primary-dark">
            Category
          </label>
          <select
            id="service-category"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
          >
            <option value="">Choose…</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Service name"
          placeholder="e.g. Leak detection & repair"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="From (R)"
          type="number"
          min={0}
          inputMode="numeric"
          placeholder="350"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <Button type="submit" disabled={saving}>
          {saving ? 'Adding…' : '+ Add service'}
        </Button>
      </form>
    </section>
  )
}
