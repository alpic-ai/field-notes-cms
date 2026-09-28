import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className } = props

  return <span className={clsx('inline-block font-serif text-2xl font-semibold tracking-tight', className)}>Field Notes<span className="text-green-700">.</span></span>
}
