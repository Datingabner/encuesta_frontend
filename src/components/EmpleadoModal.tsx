import { useState, useEffect } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import type { EmpleadoCRUD, CreateEmpleadoRequest, UpdateEmpleadoRequest } from '../types';

interface EmpleadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  empleado?: EmpleadoCRUD | null;
  onSave: (data: CreateEmpleadoRequest | UpdateEmpleadoRequest) => Promise<void>;
  isLoading?: boolean;
}

export function EmpleadoModal({ isOpen, onClose, empleado, onSave, isLoading }: EmpleadoModalProps) {
  const [formData, setFormData] = useState<CreateEmpleadoRequest>({
    numero_empleado: '',
    nombre_completo: '',
    email: '',
    id_departamento: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (empleado) {
      setFormData({
        numero_empleado: empleado.numero_empleado,
        nombre_completo: empleado.nombre_completo,
        email: empleado.email,
        id_departamento: empleado.id_departamento,
      });
    } else {
      setFormData({
        numero_empleado: '',
        nombre_completo: '',
        email: '',
        id_departamento: 0,
      });
    }
    setErrors({});
  }, [empleado, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.numero_empleado.trim()) {
      newErrors.numero_empleado = 'El número de empleado es requerido';
    }
    if (!formData.nombre_completo.trim()) {
      newErrors.nombre_completo = 'El nombre es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.id_departamento || formData.id_departamento <= 0) {
      newErrors.id_departamento = 'El departamento es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSave(formData);
  };

  const handleChange = (field: keyof CreateEmpleadoRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'id_departamento' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={empleado ? 'Editar Empleado' : 'Nuevo Empleado'}
      footer={
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Guardando...' : empleado ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Número de Empleado"
          value={formData.numero_empleado}
          onChange={handleChange('numero_empleado')}
          error={errors.numero_empleado}
          placeholder="Ej: EMP001"
          disabled={isLoading}
        />
        
        <Input
          label="Nombre Completo"
          value={formData.nombre_completo}
          onChange={handleChange('nombre_completo')}
          error={errors.nombre_completo}
          placeholder="Ej: Juan Pérez García"
          disabled={isLoading}
        />
        
        <Input
          label="Correo Electrónico"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          placeholder="Ej: juan.perez@empresa.com"
          disabled={isLoading}
        />
        
        <Input
          label="ID Departamento"
          type="number"
          value={formData.id_departamento.toString()}
          onChange={handleChange('id_departamento')}
          error={errors.id_departamento}
          placeholder="Ej: 1"
          disabled={isLoading}
        />
      </form>
    </Modal>
  );
}