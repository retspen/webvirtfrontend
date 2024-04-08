import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState } from 'react';
import { Button } from 'ui/components/button';
import { Spin } from 'ui/components/spin';
import { Table } from 'ui/components/table';
import { useToast } from 'ui/components/toast';

import {
  type Snapshot,
  deleteImage,
  SnapshotDeleteAlertDialog,
  SnapshotRestoreAlertDialog,
} from '@/entities/image';
import { type ActionType, virtanceQueries } from '@/entities/virtance';
import { State } from '@/shared/ui/state';

export function VirtanceSnapshotsTable({
  virtanceId,
  snapshots,
  runAction,
  error,
}: {
  virtanceId: number | undefined;
  snapshots: Snapshot[] | undefined;
  runAction: (type: ActionType) => Promise<void>;
  error: any;
}) {
  const queryClient = useQueryClient();
  const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot>();
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const onRestore = async (id: number) => {
    virtanceId && (await runAction({ action: 'restore', id: virtanceId, image: id }));
    await queryClient.invalidateQueries({ queryKey: virtanceQueries.snapshots(id) });
    toast({
      title: 'The task to restore a snapshot has been started.',
      variant: 'default',
    });
  };

  const onDelete = async (id: number) => {
    await deleteImage(id);
    await queryClient.invalidateQueries({ queryKey: virtanceQueries.snapshots(id) });
    toast({
      title: 'The task to delete a snapshot has been started.',
      variant: 'destructive',
    });
  };

  function onDialogOpen(snapshot: any, type: 'restore' | 'delete') {
    setSelectedSnapshot(snapshot);

    switch (type) {
      case 'restore':
        setIsRestoreDialogOpen(true);
        break;
      case 'delete':
        setIsDeleteDialogOpen(true);
        break;
    }
  }

  function onDialogClose(type: 'restore' | 'delete') {
    switch (type) {
      case 'restore':
        setIsRestoreDialogOpen(false);
        break;
      case 'delete':
        setIsDeleteDialogOpen(false);
        break;
    }
    setSelectedSnapshot(undefined);
  }

  const Actions = ({ value: snapshot }) => (
    <div className="space-x-2">
      <div className="flex justify-end space-x-2">
        <Button
          size="sm"
          variant="outline"
          disabled={!!snapshot.event}
          onClick={() => onDialogOpen(snapshot, 'restore')}
        >
          {snapshot.event && snapshot.event.name === 'restore' ? (
            <>
              <Spin size="sm" />
              <span className="ml-2">{snapshot.event.description}</span>
            </>
          ) : (
            'Restore'
          )}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={!!snapshot.event}
          onClick={() => onDialogOpen(snapshot, 'delete')}
        >
          {snapshot.event && snapshot.event.name === 'delete' ? (
            <>
              <Spin size="sm" />
              <span className="ml-2">{snapshot.event.description}</span>
            </>
          ) : (
            'Delete'
          )}
        </Button>
      </div>
    </div>
  );

  const columns = [
    {
      field: 'name',
      name: 'Name',
      component: ({ value }) => (
        <div>
          <div className="font-bold">{value.name}</div>
          <div className="text-muted-foreground text-xs">
            Size {value.size_gigabytes} GB
          </div>
        </div>
      ),
    },
    {
      field: 'created_at',
      name: 'Created at',
      formatter: (item) => format(new Date(item.created_at), 'MMM dd, yyyy'),
    },
    {
      field: 'actions',
      name: '',
      component: Actions,
    },
  ];

  if (error) {
    return (
      <div className="rounded-md border dark:border-neutral-700">
        <State
          title="Oh no..."
          description="We cannot display any snapshots at this time for some reason."
        />
      </div>
    );
  }

  return (
    <>
      {snapshots ? (
        <>
          <Table columns={columns} data={snapshots} />
          {snapshots.length === 0 ? (
            <State
              title="No snapshots"
              description="Take some snapshots to start use them."
            />
          ) : null}
        </>
      ) : null}
      {selectedSnapshot ? (
        <>
          <SnapshotRestoreAlertDialog
            open={isRestoreDialogOpen}
            onOpenChange={() => onDialogClose('restore')}
            onRestore={() => onRestore(selectedSnapshot.id)}
          />
          <SnapshotDeleteAlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={() => onDialogClose('delete')}
            onDelete={() => onDelete(selectedSnapshot.id)}
          />
        </>
      ) : null}
    </>
  );
}
