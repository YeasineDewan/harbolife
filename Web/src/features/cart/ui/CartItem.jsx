import { Link } from "react-router-dom";
import { Plus, Minus, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function CartItem({
  item,
  activeAction,
  onIncrement,
  onDecrement,
  onRemove,
}) {
  const product = item.product || item;
  const id = product._id;

  const qty = item.quantity ?? item.NOI ?? 1;
  const stockAvailable = product.pieces ?? product.stock ?? 0;

  const stripsPerBox = Number(
    product.stripsPerBox || product.strip_count || product.strips_per_box || 0,
  );
  const hasStrips = product.has_strips || stripsPerBox > 0;

  const boxPrice = Number(product.price ?? 0);
  const unitPrice = hasStrips ? boxPrice / stripsPerBox : boxPrice;
  const subtotal = (unitPrice * qty).toFixed(2);

  let qtyDisplay = "";
  if (hasStrips) {
    const boxes = Math.floor(qty / stripsPerBox);
    const strips = qty % stripsPerBox;
    if (boxes > 0 && strips > 0) qtyDisplay = `${boxes} Box + ${strips} Strip`;
    else if (boxes > 0) qtyDisplay = `${boxes} Box${boxes > 1 ? "es" : ""}`;
    else qtyDisplay = `${strips} Strip${strips > 1 ? "s" : ""}`;
  } else {
    qtyDisplay = `${qty} Item${qty > 1 ? "s" : ""}`;
  }

  let stockDisplay = "";
  if (hasStrips) {
    const sBoxes = Math.floor(stockAvailable / stripsPerBox);
    const sStrips = stockAvailable % stripsPerBox;
    if (sBoxes > 0 && sStrips > 0)
      stockDisplay = `${sBoxes} Box + ${sStrips} Strip`;
    else if (sBoxes > 0) stockDisplay = `${sBoxes} Box`;
    else stockDisplay = `${sStrips} Strip`;
  } else {
    stockDisplay = `${stockAvailable} Item${stockAvailable !== 1 ? "s" : ""}`;
  }

  const isIncLoading = activeAction.id === id && activeAction.type === "inc";
  const isDecLoading = activeAction.id === id && activeAction.type === "dec";
  const isRemLoading = activeAction.id === id && activeAction.type === "rem";
  const actionInProgress = isIncLoading || isDecLoading || isRemLoading;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center gap-4 p-4 border-b border-(--color-border-base) dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
        actionInProgress ? "opacity-70 pointer-events-none" : ""
      }`}
    >
      <Link
        to={`/product/${id}`}
        className="w-24 h-24 flex-shrink-0 bg-(--color-surface-muted) dark:bg-gray-700 rounded-xl p-2 border border-(--color-border-base) dark:border-gray-600 flex items-center justify-center"
        aria-label={`View details of ${product.name}`}
      >
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
        />
      </Link>

      <div className="flex-grow text-center sm:text-left">
        <Link
          to={`/product/${id}`}
          className="text-lg font-bold text-(--color-text-primary) dark:text-white hover:text-(--color-primary-600) dark:hover:text-green-400 transition-colors"
        >
          {product.name}
        </Link>
        <div className="text-sm text-(--color-text-secondary) dark:text-gray-400 mt-1 line-clamp-1">
          {product.desc || product.description}
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label={`Increase quantity of ${product.name}`}
              onClick={() => onIncrement(item, hasStrips, stripsPerBox)}
              disabled={stockAvailable <= qty || actionInProgress}
              isLoading={isIncLoading}
              className="w-8 h-8 rounded-lg border border-(--color-primary-600) text-(--color-primary-600) hover:bg-(--color-primary-50) dark:hover:bg-(--color-primary-900)"
            >
              {!isIncLoading && <Plus className="w-4 h-4" aria-hidden="true" />}
            </Button>
            <div className="min-w-[6rem] text-center font-bold text-(--color-text-primary) dark:text-white bg-(--color-surface-muted) dark:bg-gray-700 py-1 px-2 rounded-lg text-sm">
              {qtyDisplay}
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label={`Decrease quantity of ${product.name}`}
              onClick={() => onDecrement(item, hasStrips, stripsPerBox)}
              disabled={actionInProgress}
              isLoading={isDecLoading}
              className="w-8 h-8 rounded-lg border border-(--color-warning-600) text-(--color-warning-600) hover:bg-(--color-warning-50) dark:hover:bg-(--color-warning-900)"
            >
              {!isDecLoading && (
                <Minus className="w-4 h-4" aria-hidden="true" />
              )}
            </Button>
          </div>
          <div className="text-(--color-text-primary) dark:text-gray-300 font-semibold">
            ${unitPrice.toFixed(2)}{" "}
            <span className="text-sm text-(--color-text-secondary) font-normal">
              {hasStrips ? "/ strip" : "/ item"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-4">
        <div className="text-right">
          <div className="text-xl font-bold text-(--color-text-primary) dark:text-white">
            ${subtotal}
          </div>
          <div className="text-xs text-(--color-text-secondary) dark:text-gray-400 mt-1">
            {stockDisplay} in stock
          </div>
        </div>
        <Button
          variant="danger-ghost"
          size="icon"
          aria-label={`Remove ${product.name} from cart`}
          onClick={() => onRemove(id)}
          disabled={actionInProgress}
          isLoading={isRemLoading}
          className="text-(--color-danger-500) hover:text-(--color-danger-700) p-2 rounded-lg hover:bg-(--color-danger-50) dark:hover:bg-(--color-danger-900)"
        >
          {!isRemLoading && <Trash2 className="w-5 h-5" aria-hidden="true" />}
        </Button>
      </div>
    </div>
  );
}
