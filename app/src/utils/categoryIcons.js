export function iconForCategory(category) {
  const key = String(category).toLowerCase()
  if (key === 'vše') return 'mdi-view-list'
  if (key.includes('polév')) return 'mdi-pot-steam-outline'
  if (key.includes('těstov')) return 'mdi-pasta'
  if (key.includes('pomazán')) return 'mdi-bread-slice-outline'
  if (key.includes('moučník') || key.includes('dezert') || key.includes('slad')) return 'mdi-cupcake'
  if (key.includes('svačin') || key.includes('snída') || key.includes('pala')) return 'mdi-food-croissant'
  if (key.includes('salát')) return 'mdi-food-outline'
  if (key.includes('oběd') || key.includes('hlav') || key.includes('maso')) return 'mdi-food-steak'
  if (key.includes('večeř')) return 'mdi-silverware-fork-knife'
  if (key.includes('zavařen')) return 'mdi-jar-outline'
  if (key.includes('příloh')) return 'mdi-food-variant'
  return 'mdi-tag-outline'
}
