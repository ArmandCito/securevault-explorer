/**
 * Returns the file extension in uppercase, e.g. "PDF", "XLSX"
 */
export function getFileExtension(name) {
  const parts = name.split('.')
  if (parts.length < 2) return 'FILE'
  return parts[parts.length - 1].toUpperCase()
}

/**
 * Returns a human-readable file type label based on extension.
 */
export function getFileTypeLabel(name) {
  const ext = getFileExtension(name).toLowerCase()
  const map = {
    pdf:  'PDF Document',
    docx: 'Word Document',
    doc:  'Word Document',
    xlsx: 'Excel Spreadsheet',
    xls:  'Excel Spreadsheet',
    png:  'PNG Image',
    jpg:  'JPEG Image',
    jpeg: 'JPEG Image',
    svg:  'SVG Image',
    txt:  'Text File',
    yaml: 'YAML Config',
    yml:  'YAML Config',
    json: 'JSON File',
    ttf:  'Font File',
    log:  'Log File',
    md:   'Markdown File',
  }
  return map[ext] || `${getFileExtension(name)} File`
}

/**
 * Returns a color class name for the file icon badge.
 */
export function getExtColor(name) {
  const ext = getFileExtension(name).toLowerCase()
  if (['pdf'].includes(ext))                     return 'ext-pdf'
  if (['doc', 'docx'].includes(ext))             return 'ext-doc'
  if (['xls', 'xlsx'].includes(ext))             return 'ext-xls'
  if (['png', 'jpg', 'jpeg', 'svg'].includes(ext)) return 'ext-img'
  if (['txt', 'md', 'log'].includes(ext))        return 'ext-txt'
  if (['yaml', 'yml', 'json'].includes(ext))     return 'ext-cfg'
  if (['ttf', 'otf', 'woff'].includes(ext))      return 'ext-fnt'
  return 'ext-default'
}

/**
 * Recursively counts total files and folders in a node list.
 */
export function countItems(nodes) {
  let files = 0
  let folders = 0
  function walk(list) {
    for (const node of list) {
      if (node.type === 'file') {
        files++
      } else {
        folders++
        if (node.children?.length) walk(node.children)
      }
    }
  }
  walk(nodes)
  return { files, folders, total: files + folders }
}

/**
 * findPath
 * Recursively walks the tree to find the full ancestor chain of a node.
 *
 * Returns an array of nodes from root → target, inclusive.
 * Example: findPath(tree, 'email_1') →
 *   [ {id:'root_1', name:'01_Legal_Department',...},
 *     {id:'leg_1',  name:'Active_Cases',...},
 *     {id:'case_a', name:'Doe_vs_MegaCorp_Inc',...},
 *     {id:'disc_1', name:'Discovery_Phase',...},
 *     {id:'email_1',name:'Email_Thread_Jan2024.pdf',...} ]
 *
 * Returns null if the id is not found.
 */
export function findPath(nodes, targetId) {
  for (const node of nodes) {
    if (node.id === targetId) return [node]
    if (node.type === 'folder' && node.children?.length) {
      const sub = findPath(node.children, targetId)
      if (sub) return [node, ...sub]
    }
  }
  return null
}

/**
 * A simulated "modified" date — derived deterministically from the node id.
 * In a real app this would come from the API.
 */
export function getModifiedDate(id) {
  const dates = [
    'Jan 15, 2024',
    'Mar 22, 2024',
    'Apr 03, 2025',
    'Nov 08, 2023',
    'Feb 14, 2025',
    'Dec 01, 2024',
    'Sep 19, 2024',
  ]
  // Deterministic pick based on string hash
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffff
  return dates[hash % dates.length]
}
