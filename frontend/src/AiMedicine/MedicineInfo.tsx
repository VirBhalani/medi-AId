import type React from "react"

interface MedicineInfoProps {
  info: {
    name: string
    type: string
    description: string
    dosage: string
    disease: string
  }
}

const MedicineInfo: React.FC<MedicineInfoProps> = ({ info }) => {
  return (
    <div className="space-y-2">
      <h3 className="font-bold text-lg">{info.name}</h3>

      <div>
        <span className="font-medium">Type: </span>
        <span>{info.type}</span>
      </div>

      <div>
        <span className="font-medium">Description: </span>
        <span>{info.description}</span>
      </div>

      <div>
        <span className="font-medium">Dosage: </span>
        <span>{info.dosage}</span>
      </div>

      <div>
        <span className="font-medium">Used for: </span>
        <span>{info.disease}</span>
      </div>
    </div>
  )
}

export default MedicineInfo

