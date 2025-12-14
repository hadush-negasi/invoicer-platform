import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '../services/api';

export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: () => invoiceService.getAll(),
  });
};

export const useInvoice = (id: number) => {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => invoiceService.getById(id),
    enabled: !!id,
  });
};

export const useInvoiceStats = () => {
  return useQuery({
    queryKey: ['invoices', 'stats'],
    queryFn: () => invoiceService.getStats(),
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => invoiceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', 'stats'] });
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => invoiceService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['invoices', 'stats'] });
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => invoiceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', 'stats'] });
    },
  });
};

export const useSendInvoiceEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => invoiceService.sendEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};


