import { FC } from 'react'

const Spinner: FC = () => {
  return (
    <div className='w-full flex-1 flex items-center justify-center'>
      <div className='lds-roller'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default Spinner
