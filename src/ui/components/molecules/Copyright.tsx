export function Copyright() {
  const year = new Date().getFullYear();
  return (
    <small className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
      © {year} The Editorial Kitchen. All rights reserved.
    </small>
  );
}
