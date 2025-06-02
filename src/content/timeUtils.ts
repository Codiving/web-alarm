// function formatTime(date) {
//   return [date.getHours(), date.getMinutes(), date.getSeconds()]
//     .map((u) => String(u).padStart(2, "0"))
//     .join(":");
// }

// export { formatTime };

function formatTime(date: Date) {
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((u) => String(u).padStart(2, "0"))
    .join(":");
}

export { formatTime };
