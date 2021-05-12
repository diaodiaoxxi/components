<template>
  <div
    v-if="maxTagCount === undefined || index < maxTagCount"
    :key="`${PREFIX}-tag-${index}`"
    :class="`${PREFIX}-tag ${PREFIX}-tag-checked ${PREFIX}-text-tag`"
    data-name="tag-cell"
    contenteditable="true"
    tabindex="0"
    @keydown.left="onTextTagKeydown($event, 'left')"
    @keydown.right="onTextTagKeydown($event, 'right')"
    @keydown.delete="onTextTagKeydown($event, 'delete', item)"
    @focus="onTextTagFocus($event)"
  >
    <span :class="`${PREFIX}-tag-text`">
      {{ item.tag !== undefined ? item.tag : item.label }}
    </span>
    <span :class="`${PREFIX}-tag-text`" v-if=" maxTagCount === undefined || (index < maxTagCount - 1 && selectedOptions.length > 1) " >，</span >
    <span :class="`${PREFIX}-tag-text`" v-if=" index == maxTagCount - 1 && maxTagCount !== undefined && selectedOptions.length > maxTagCount " >，</span >
  </div>
</template>
<script>
export default {
  name: 'SelectTextTag',
  props: [
    'PREFIX',
    'index',
    'item',
    'maxTagCount',
    'selectedOptions',
    'onTextTagKeydown',
    'onTextTagFocus'
  ]
}
</script>
