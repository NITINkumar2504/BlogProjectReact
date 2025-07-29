import React, {useId} from 'react'

const SelectField = ({options, label, className = '', ...props},ref) => {
    
    const id = useId();

  return (
    <div className='w-full'>
      {label && 
        <label className='' htmlFor={id}></label>}
        <select 
        name="" 
        id={id} 
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`} {...props} 
        ref={ref}>
            {options?.map((option) => (
                <option value={option} key={option}>{option}</option>
            ))}
        </select>
    </div>
  )
}

export default React.forwardRef(SelectField)