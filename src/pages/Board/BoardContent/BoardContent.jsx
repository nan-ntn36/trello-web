import Box from '@mui/material/Box';
import ListColumns from './ListColumns/ListColumns';
import { mapOrder } from '~/utils/sort';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
} from '@dnd-kit/core';
import { useEffect, useState, useCallback, useRef } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import Column from './ListColumns/Column/Column';
import TrelloCard from './ListColumns/Column/ListCards/Card/Card';
import { cloneDeep, isEmpty } from 'lodash';
import { generatePlaceholder } from '~/utils/formats';

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
};

function BoardContent({ board }) {
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });
  // Yêu cầu di chuyển chuột thì mới kích hoạt event, fix trương hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  //Nhấn giữ 250ms va dùng sai cảm ứng  thì mới kích hoạt event
  const touchsSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 },
  });
  // const sensors = useSensors(pointerSensor);
  // ưu tiên sử dụng mousesensor và touchsensor để trải nghiệm trên mobile tốt nhất khong bug
  const sensors = useSensors(mouseSensor, touchsSensor);
  const [orderedColumns, setOrderedColumn] = useState([]);
  // cùng 1 thời điểm chỉ có 1 phần tử được kéo, -> xữ lý giữ chổ khi xóa
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemStype, setActiveDragItemStype] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [oldColumnWhenDragCard, setOldColumnWhenDragCard] = useState(null);

  // Điểm va chạm cuối cùng
  const lastOverId = useRef(null);

  useEffect(() => {
    setOrderedColumn(mapOrder(board?.columns, board?.columnOrderIds, '_id'));
  }, [board]);

  /// tìm columns theo cardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card?._id)?.includes(cardId)
    );
  };

  // Cập nhật state trong trường hợp duy chuyển giữa các column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDragCardId,
    activeDragCardData
  ) => {
    setOrderedColumn((prevColumns) => {
      // tìm vị trí index của cái overCard trong column đích(nơi mà sẽ thả card vào)
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      );

      // xử lý card index mới
      let newCardIndex;
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 1 : 0;

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1;
      // clone mảng cũ ra mảng mới dùng thư viên lodash
      const nextColumns = cloneDeep(prevColumns);

      // tìm column
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      );
      // column cũ
      if (nextActiveColumn) {
        // xóa card khỏi column ban đầu
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDragCardId
        );
        // Thêm Placeholcard nếu như column đó rỗng
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholder(nextActiveColumn)];
        }
        //cập nhật lại mảng cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        );
      }
      // column mới
      if (nextOverColumn) {
        // kiểm tra xem card đang kéo có tồn tại ở overColumn chưa, nếu có thì xoa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDragCardId
        );

        // xóa placeholder card
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard
        );

        // thêm card đã kéo vào over column mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, {
          ...activeDragCardData,
          columnId: nextOverColumn._id,
        });

        //cập nhật lại mảng cardOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        );
      }
      console.log(nextColumns);
      return nextColumns;
    });
  };
  const handleDragStart = (event) => {
    //set dữ liệu kéo
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemStype(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);

    //nếu là kéo card thì mới set giá trị
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDragCard(findColumnByCardId(event?.active?.id));
    }
  };

  //quá trình kéo 1 phần tử
  const handleDragOver = (event) => {
    const { active, over } = event;
    const {
      id: activeDragCardId,
      data: { current: activeDragCardData },
    } = active;
    const { id: overCardId } = over || {};
    const activeColumn = findColumnByCardId(activeDragCardId);
    const overColumn = findColumnByCardId(overCardId);

    // xữ lý kéo card qua lại giữa các column
    if (activeDragItemStype === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;
    if (!over || !active) return;
    if (!activeColumn || !overColumn) return;

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDragCardId,
        activeDragCardData
      );
    }
  };

  const handleDragEnd = (event) => {
    // console.log(event);
    const { active, over } = event;
    if (!over) return;

    // Kiểm tra la đang kéo card
    if (activeDragItemStype === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDragCardId,
        data: { current: activeDragCardData },
      } = active;
      const { id: overCardId } = over;

      const activeColumn = findColumnByCardId(activeDragCardId);
      const overColumn = findColumnByCardId(overCardId);

      if (!activeColumn || !overColumn) return;

      // Hành đông kéo thả card giữa 2 column khác nhau
      if (oldColumnWhenDragCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDragCardId,
          activeDragCardData
        );
      } else {
        const oldCardIndex = oldColumnWhenDragCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId
        ); // tìm vị trí củ oldColumnWhenDragCard

        const newCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        ); // tìm vị trí over
        // kéo card sang 1 colum thì tương tự kéo column trong board content
        const dndOrderedCard = arrayMove(
          oldColumnWhenDragCard?.cards,
          oldCardIndex,
          newCardIndex
        );

        setOrderedColumn((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns);

          const targetColumn = nextColumns.find(
            (column) => column._id === overColumn._id
          );

          //cập nhật giá trị mới là card và cardsOrder
          targetColumn.cards = dndOrderedCard;

          targetColumn.cardOrderIds = dndOrderedCard?.map((card) => card._id);

          return nextColumns;
        });
      }
    }

    // xữ lý kéo thả column
    if (activeDragItemStype === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id != over.id) {
        const oldColumIndex = orderedColumns.findIndex(
          (c) => c._id === active.id
        ); // tìm vị trí active
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id
        ); // tìm vị trí over

        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumIndex,
          newColumnIndex
        );
        // const dndOrderedColumnIds = dndOrderedColumns.map((c) => c._id);
        // console.log('dndOrderColumn',dndOrderedColumns)
        // console.log('dndOrderColumnIds',dndOrderedColumnIds)
        setOrderedColumn(dndOrderedColumns);
      }
    }

    //set dữ liệu khi thả = null
    setActiveDragItemId(null);
    setActiveDragItemStype(null);
    setActiveDragItemData(null);
    setOldColumnWhenDragCard(null);
  };

  const dropAnimationCustum = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };
  const collisionDetectionStrategy = useCallback(
    (args) => {
      // trường hợp kéo column dùng thuật toán closestCorners là chuẩn nhất
      if (activeDragItemStype === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }
      // Đầu tiên, hãy xem có va chạm nào với con trỏ không
      const pointerIntersections = pointerWithin(args);

      if (!pointerIntersections?.length) return;
      // Thuật toán phát hiện va chạm  sẽ trả về một mảng các va chạm ở đây
      // const intersections = !pointerIntersections?.length
      //   ? pointerIntersections
      //   : rectIntersection(args);

      // Tìm thằng over đầu tiên trong đám intersections ở trên
      let overId = getFirstCollision(pointerIntersections, 'id');

      if (overId) {
        const checkColumn = orderedColumns.find(
          (column) => column._id === overId
        );

        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                );
              }
            ),
          })[0]?.id;
        }

        lastOverId.current = overId;
        return [{ id: overId }];
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemStype, orderedColumns]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      // thuật toán va chạm, nếu không có thì card lớn không thể kéo qua column khác được
      // nếu chỉ dùng closestCorners sẽ có bug flickering + sai lệch dữ liệu
      // collisionDetection={closestCorners}
      // Custum thuật toán va chạm của thư viện
      collisionDetection={collisionDetectionStrategy}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          width: '100%',
          height: (theme) => theme.trelloCustom.boardContentHeight,
          p: '10px 0',
        }}
      >
        <ListColumns columns={orderedColumns} />
        {/* giữ chổ khi kéo */}
        <DragOverlay dropAnimation={dropAnimationCustum}>
          {!activeDragItemStype && null}
          {activeDragItemStype === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemStype === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <TrelloCard card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;
