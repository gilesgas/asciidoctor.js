/**
 * Convert a JSON to an (Opal) Hash.
 * @private
 */
var toHash = function (object) {
  return object && !('$$smap' in object) ? Opal.hash(object) : object;
};

/**
 * Convert an (Opal) Hash to JSON.
 * @private
 */
var fromHash = function (hash) {
  var object = {};
  for (var i = 0, keys = hash.$$keys, data = hash.$$smap, len = keys.length; i < len; i++) {
    var key = keys[i];
    object[key] = data[key];
  }
  return object;
};

/**
 * @private
 */
var prepareOptions = function (options) {
  if (options = toHash(options)) {
    var attrs = options['$[]']('attributes');
    if (attrs && typeof attrs === 'object' && attrs.constructor.name === 'Object') {
      options = options.$dup();
      options['$[]=']('attributes', toHash(attrs));
    }
  }
  return options;
};

// Asciidoctor API

/**
 * @namespace
 * @description
 * Methods for parsing AsciiDoc input files and converting documents.
 *
 * AsciiDoc documents comprise a header followed by zero or more sections.
 * Sections are composed of blocks of content. For example:
 * <pre>
 *   = Doc Title
 *
 *   == Section 1
 *
 *   This is a paragraph block in the first section.
 *
 *   == Section 2
 *
 *   This section has a paragraph block and an olist block.
 *
 *   . Item 1
 *   . Item 2
 * </pre>
 *
 * @example
 * asciidoctor.convertFile('sample.adoc');
 */
var Asciidoctor = Opal.Asciidoctor['$$class'];

/**
 * Get Asciidoctor core version number.
 *
 * @memberof Asciidoctor
 * @returns {string} - returns the version number of Asciidoctor core.
 */
Asciidoctor.prototype.getCoreVersion = function () {
  return this.$$const.VERSION;
};

/**
 * Get Asciidoctor.js runtime environment informations.
 *
 * @memberof Asciidoctor
 * @returns {Object} - returns the runtime environement including the ioModule, the platform, the engine and the framework.
 */
Asciidoctor.prototype.getRuntime = function () {
  return {
    ioModule: Opal.const_get_qualified('::', 'JAVASCRIPT_IO_MODULE'),
    platform: Opal.const_get_qualified('::', 'JAVASCRIPT_PLATFORM'),
    engine: Opal.const_get_qualified('::', 'JAVASCRIPT_ENGINE'),
    framework: Opal.const_get_qualified('::', 'JAVASCRIPT_FRAMEWORK')
  };
};

/**
 * Parse the AsciiDoc source input into an {@link Document} and convert it to the specified backend format.
 *
 * Accepts input as a Buffer or String.
 *
 * @param {string|Buffer} input - AsciiDoc input as String or Buffer
 * @param {Object} options - a JSON of options to control processing (default: {})
 * @returns {string|Document} - returns the {@link Document} object if the converted String is written to a file,
 * otherwise the converted String
 * @memberof Asciidoctor
 * @example
 * var input = '= Hello, AsciiDoc!\n' +
 *   'Guillaume Grossetie <ggrossetie@example.com>\n\n' +
 *   'An introduction to http://asciidoc.org[AsciiDoc].\n\n' +
 *   '== First Section\n\n' +
 *   '* item 1\n' +
 *   '* item 2\n';
 *
 * var html = asciidoctor.convert(input);
 */
Asciidoctor.prototype.convert = function (input, options) {
  if (typeof input === 'object' && input.constructor.name === 'Buffer') {
    input = input.toString('utf8');
  }
  var result = this.$convert(input, prepareOptions(options));
  return result === Opal.nil ? '' : result;
};

/**
 * Parse the AsciiDoc source input into an {@link Document} and convert it to the specified backend format.
 *
 * @param {string} filename - source filename
 * @param {Object} options - a JSON of options to control processing (default: {})
 * @returns {string|Document} - returns the {@link Document} object if the converted String is written to a file,
 * otherwise the converted String
 * @memberof Asciidoctor
 * @example
 * var html = asciidoctor.convertFile('./document.adoc');
 */
Asciidoctor.prototype.convertFile = function (filename, options) {
  return this.$convert_file(filename, prepareOptions(options));
};

/**
 * Parse the AsciiDoc source input into an {@link Document}
 *
 * Accepts input as a Buffer or String.
 *
 * @param {string|Buffer} input - AsciiDoc input as String or Buffer
 * @param {Object} options - a JSON of options to control processing (default: {})
 * @returns {Document} - returns the {@link Document} object
 * @memberof Asciidoctor
 */
Asciidoctor.prototype.load = function (input, options) {
  if (typeof input === 'object' && input.constructor.name === 'Buffer') {
    input = input.toString('utf8');
  }
  return this.$load(input, prepareOptions(options));
};

/**
 * Parse the contents of the AsciiDoc source file into an {@link Document}
 *
 * @param {string} filename - source filename
 * @param {Object} options - a JSON of options to control processing (default: {})
 * @returns {Document} - returns the {@link Document} object
 * @memberof Asciidoctor
 */
Asciidoctor.prototype.loadFile = function (filename, options) {
  return this.$load_file(filename, prepareOptions(options));
};

// AbstractBlock API

/**
 * @namespace
 * @extends AbstractNode
 */
var AbstractBlock = Opal.Asciidoctor.AbstractBlock;

/**
 * Get the String title of this Block with title substitions applied
 *
 * The following substitutions are applied to block and section titles:
 *
 * <code>specialcharacters</code>, <code>quotes</code>, <code>replacements</code>, <code>macros</code>, <code>attributes</code> and <code>post_replacements</code>
 *
 * @memberof AbstractBlock
 * @returns {string} - returns the converted String title for this Block, or undefined if the title is not set.
 * @example
 * block.title // "Foo 3^ # {two-colons} Bar(1)"
 * block.getTitle(); // "Foo 3^ # :: Bar(1)"
 */
AbstractBlock.prototype.getTitle = function () {
  var title = this.$title();
  return title === Opal.nil ? undefined : title;
};

/**
 * Convenience method that returns the interpreted title of the Block
 * with the caption prepended.
 * Concatenates the value of this Block's caption instance variable and the
 * return value of this Block's title method. No space is added between the
 * two values. If the Block does not have a caption, the interpreted title is
 * returned.
 *
 * @memberof AbstractBlock
 * @returns {string} - the converted String title prefixed with the caption, or just the
 * converted String title if no caption is set
 */
AbstractBlock.prototype.getCaptionedTitle = function () {
  return this.$captioned_title();
};

/**
 * Get the style (block type qualifier) for this block.
 * @memberof AbstractBlock
 * @returns {string} - returns the style for this block
 */
AbstractBlock.prototype.getStyle = function () {
  return this.style;
};

/**
 * Get the caption for this block.
 * @memberof AbstractBlock
 * @returns {string} - returns the caption for this block
 */
AbstractBlock.prototype.getCaption = function () {
  return this.$caption();
};

/**
 * Set the caption for this block.
 * @param {string} caption - Caption
 * @memberof AbstractBlock
 */
AbstractBlock.prototype.setCaption = function (caption) {
  this.caption = caption;
};

/**
 * Get the level of this section or the section level in which this block resides.
 * @memberof AbstractBlock
 * @returns {number} - returns the level of this section
 */
AbstractBlock.prototype.getLevel = function () {
  return this.level;
};

/**
 * Get the substitution keywords to be applied to the contents of this block.
 *
 * @memberof AbstractBlock
 * @returns {Array} - the list of {string} substitution keywords associated with this block.
 */
AbstractBlock.prototype.getSubstitutions = function () {
  return this.subs;
};

/**
 * Check whether a given substitution keyword is present in the substitutions for this block.
 *
 * @memberof AbstractBlock
 * @returns {boolean} - whether the substitution is present on this block.
 */
AbstractBlock.prototype.hasSubstitution = function (substitution) {
  return this['$sub?'](substitution);
};

/**
 * Remove the specified substitution keyword from the list of substitutions for this block.
 *
 * @memberof AbstractBlock
 * @returns undefined
 */
AbstractBlock.prototype.removeSubstitution = function (substitution) {
  this.$remove_sub(substitution);
};

/**
 * Get the list of {@link AbstractBlock} sub-blocks for this block.
 * @memberof AbstractBlock
 * @returns {Array} - returns a list of {@link AbstractBlock} sub-blocks
 */
AbstractBlock.prototype.getBlocks = function () {
  return this.blocks;
};

/**
 * Get the converted result of the child blocks by converting the children appropriate to content model that this block supports.
 * @memberof AbstractBlock
 * @returns {string} - returns the converted result of the child blocks
 */
AbstractBlock.prototype.getContent = function () {
  return this.$content();
};

/**
 * Get the converted content for this block.
 * If the block has child blocks, the content method should cause them to be converted
 * and returned as content that can be included in the parent block's template.
 * @memberof AbstractBlock
 * @returns {string} - returns the converted String content for this block
 */
AbstractBlock.prototype.convert = function () {
  return this.$convert();
};

/**
 * Query for all descendant block-level nodes in the document tree
 * that match the specified selector (context, style, id, and/or role).
 * If a function block is given, it's used as an additional filter.
 * If no selector or function block is supplied, all block-level nodes in the tree are returned.
 * @param {Object} [selector]
 * @param {function} [block]
 * @example
 * doc.findBy({'context': 'section'});
 * // => { level: 0, title: "Hello, AsciiDoc!", blocks: 0 }
 * // => { level: 1, title: "First Section", blocks: 1 }
 *
 * doc.findBy({'context': 'section'}, function (section) { return section.getLevel() === 1; });
 * // => { level: 1, title: "First Section", blocks: 1 }
 *
 * doc.findBy({'context': 'listing', 'style': 'source'});
 * // => { context: :listing, content_model: :verbatim, style: "source", lines: 1 }
 *
 * @memberof AbstractBlock
 * @returns {Array} - returns a list of block-level nodes that match the filter or an empty list if no matches are found
 */
AbstractBlock.prototype.findBy = function (selector, block) {
  if (typeof block === 'undefined' && typeof selector === 'function') {
    return Opal.send(this, 'find_by', null, selector);
  }
  else if (typeof block === 'function') {
    return Opal.send(this, 'find_by', [toHash(selector)], block);
  }
  else {
    return this.$find_by(toHash(selector));
  }
};

/**
 * Get the source line number where this block started.
 * @memberof AbstractBlock
 * @returns {number} - returns the source line number where this block started
 */
AbstractBlock.prototype.getLineNumber = function () {
  var lineno = this.$lineno();
  return lineno === Opal.nil ? undefined : lineno;
};

/**
 * Check whether this block has any child Section objects.
 * Only applies to Document and Section instances.
 * @memberof AbstractBlock
 * @returns {boolean} - true if this block has child Section objects, otherwise false
 */
AbstractBlock.prototype.hasSections = function () {
  return this['$sections?']();
};

/**
 * Get the Array of child Section objects.
 * Only applies to Document and Section instances.
 * @memberof AbstractBlock
 * @returns {Array} - returns an {Array} of {@link Section} objects
 */
AbstractBlock.prototype.getSections = function () {
  return this.$sections();
};

// Section API

/**
 * @namespace
 * @extends AbstractBlock
 */
var Section = Opal.Asciidoctor.Section;

/**
 * Get the 0-based index order of this section within the parent block.
 * @memberof Section
 * @returns {number}
 */
Section.prototype.getIndex = function () {
  return this.index;
};

/**
 * Set the 0-based index order of this section within the parent block.
 * @memberof Section
 */
Section.prototype.setIndex = function (value) {
  this.index = value;
};

/**
 * Get the section name of this section.
 * @memberof Section
 * @returns {string}
 */
Section.prototype.getSectionName = function () {
  return this.sectname;
};

/**
 * Set the section name of this section.
 * @memberof Section
 */
Section.prototype.setSectionName = function (value) {
  this.sectname = value;
};

/**
 * Get the flag to indicate whether this is a special section or a child of one.
 * @memberof Section
 * @returns {boolean}
 */
Section.prototype.isSpecial = function () {
  return this.special;
};

/**
 * Set the flag to indicate whether this is a special section or a child of one.
 * @memberof Section
 */
Section.prototype.setSpecial = function (value) {
  this.special = value;
};

/**
 * Get the state of the numbered attribute at this section (need to preserve for creating TOC).
 * @memberof Section
 * @returns {boolean}
 */
Section.prototype.isNumbered = function () {
  return this.numbered;
};

/**
 * Get the caption for this section (only relevant for appendices).
 * @memberof Section
 * @returns {string}
 */
Section.prototype.getCaption = function () {
  var value = this.caption;
  return value === Opal.nil ? undefined : value;
};

/**
 * Get the name of the Section (title)
 * @memberof Section
 * @returns {string}
 * @see {@link AbstractBlock#getTitle}
 */
Section.prototype.getName = function () {
  return this.getTitle();
};

/**
 * @namespace
 */
var Block = Opal.Asciidoctor.Block;

/**
 * Get the source of this block.
 * @memberof Block
 * @returns {string} - returns the String source of this block.
 */
Block.prototype.getSource = function () {
  return this.$source();
};

/**
 * Get the source lines of this block.
 * @memberof Block
 * @returns {Array} - returns the String {Array} of source lines for this block.
 */
Block.prototype.getSourceLines = function () {
  return this.lines;
};

// AbstractNode API

/**
 * @namespace
 */
var AbstractNode = Opal.Asciidoctor.AbstractNode;

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.getAttributes = function () {
  // Do not use fromHash here since we want to keep only entries
  // whose key is a string. By definition this *is* $$smap
  return Object.assign({}, this.attributes.$$smap);
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.getAttribute = function (name, defaultValue, inherit) {
  var value = this.$attr(name, defaultValue, inherit);
  return value === Opal.nil ? undefined : value;
};

/**
 * Check whether the specified attribute is present on this node.
 *
 * @memberof AbstractNode
 * @returns {boolean} - true if the attribute is present, otherwise false
 */
AbstractNode.prototype.hasAttribute = function (name) {
  return name in this.attributes.$$smap;
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.isAttribute = function (name, expectedValue, inherit) {
  var result = this['$attr?'](name, expectedValue, inherit);
  return result === Opal.nil ? false : result;
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.setAttribute = function (name, value, overwrite) {
  if (typeof overwrite === 'undefined') overwrite = true;
  return this.$set_attr(name, value, overwrite);
};

/**
 * Remove the attribute from the current node.
 * @param {string} name - The String attribute name to remove
 * @returns {string} - returns the previous {String} value, or undefined if the attribute was not present.
 * @memberof AbstractNode
 */
AbstractNode.prototype.removeAttribute = function (name) {
  var value = this.$remove_attr(name);
  return value === Opal.nil ? undefined : value;
};

/**
 * Get the {@link Document} to which this node belongs.
 *
 * @memberof AbstractNode
 * @returns {Document} - returns the {@link Document} object to which this node belongs.
 */
AbstractNode.prototype.getDocument = function () {
  return this.document;
};

/**
 * Get the {@link AbstractNode} to which this node is attached.
 *
 * @memberof AbstractNode
 * @returns {AbstractNode} - returns the {@link AbstractNode} object to which this node is attached,
 * or undefined if this node has no parent.
 */
AbstractNode.prototype.getParent = function () {
  var parent = this.parent;
  return parent === Opal.nil ? undefined : parent;
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.isInline = function () {
  return this['$inline?']();
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.isBlock = function () {
  return this['$block?']();
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.isRole = function (expected) {
  return this['$role?'](expected);
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.getRole = function () {
  return this.$role();
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.hasRole = function (name) {
  return this['$has_role?'](name);
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.getRoles = function () {
  return this.$roles();
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.addRole = function (name) {
  return this.$add_role(name);
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.removeRole = function (name) {
  return this.$remove_role(name);
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.isReftext = function () {
  return this['$reftext?']();
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.getReftext = function () {
  return this.$reftext();
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.getContext = function () {
  var context = this.context;
  // Automatically convert Opal pseudo-symbol to String
  return typeof context === 'string' ? context : context.toString();
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.getId = function () {
  return this.id;
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.isOption = function (name) {
  return this['$option?'](name);
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.setOption = function (name) {
  return this.$set_option(name);
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.getIconUri = function (name) {
  return this.$icon_uri(name);
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.getMediaUri = function (target, assetDirKey) {
  return this.$media_uri(target, assetDirKey);
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.getImageUri = function (targetImage, assetDirKey) {
  return this.$image_uri(targetImage, assetDirKey);
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.getConverter = function () {
  return this.$converter();
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.readContents = function (target, options) {
  return this.$read_contents(target, toHash(options));
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.readAsset = function (path, options) {
  return this.$read_asset(path, toHash(options));
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.normalizeWebPath = function (target, start, preserveTargetUri) {
  return this.$normalize_web_path(target, start, preserveTargetUri);
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.normalizeSystemPath = function (target, start, jail, options) {
  return this.$normalize_system_path(target, start, jail, toHash(options));
};

/**
 * @memberof AbstractNode
 */
AbstractNode.prototype.normalizeAssetPath = function (assetRef, assetName, autoCorrect) {
  return this.$normalize_asset_path(assetRef, assetName, autoCorrect);
};

// Document API

/**
 * The {@link Document} class represents a parsed AsciiDoc document.
 *
 * Document is the root node of a parsed AsciiDoc document.<br/>
 * It provides an abstract syntax tree (AST) that represents the structure of the AsciiDoc document
 * from which the Document object was parsed.
 *
 * Although the constructor can be used to create an empty document object,
 * more commonly, you'll load the document object from AsciiDoc source
 * using the primary API methods on {@link Asciidoctor}.
 * When using one of these APIs, you almost always want to set the safe mode to 'safe' (or 'unsafe')
 * to enable all of Asciidoctor's features.
 *
 * <pre>
 *   var doc = Asciidoctor.load('= Hello, AsciiDoc!', {'safe': 'safe'});
 *   // => Asciidoctor::Document { doctype: "article", doctitle: "Hello, Asciidoc!", blocks: 0 }
 * </pre>
 *
 * Instances of this class can be used to extract information from the document or alter its structure.
 * As such, the Document object is most often used in extensions and by integrations.
 *
 * The most basic usage of the Document object is to retrieve the document's title.
 *
 * <pre>
 *  var source = '= Document Title';
 *  var doc = asciidoctor.load(source, {'safe': 'safe'});
 *  console.log(doc.getTitle()); // 'Document Title'
 * </pre>
 *
 * You can also use the Document object to access document attributes defined in the header, such as the author and doctype.
 * @namespace
 * @extends AbstractBlock
 */
var Document = Opal.Asciidoctor.Document;

/**
 * @returns {string} - returns the level-0 section
 * @memberof Document
 */
Document.prototype.getHeader = function () {
  return this.header;
};

/**
 * @memberof Document
 */
Document.prototype.setAttribute = function (name, value) {
  return this.$set_attribute(name, value);
};

/**

 * @memberof Document
 */
Document.prototype.removeAttribute = function (name) {
  this.attributes.$delete(name);
  this.attribute_overrides.$delete(name);
};

/**
 * @memberof Document
 */
Document.prototype.convert = function (options) {
  var result = this.$convert(toHash(options));
  return result === Opal.nil ? '' : result;
};

/**
 * @memberof Document
 */
Document.prototype.write = function (output, target) {
  return this.$write(output, target);
};

/**
 * @returns {string} - returns the full name of the author as a String
 * @memberof Document
 */
Document.prototype.getAuthor = function () {
  return this.$author();
};

/**
 * @memberof Document
 */
Document.prototype.getSource = function () {
  return this.$source();
};

/**
 * @memberof Document
 */
Document.prototype.getSourceLines = function () {
  return this.$source_lines();
};

/**
 * @memberof Document
 */
Document.prototype.isNested = function () {
  return this['$nested?']();
};

/**
 * @memberof Document
 */
Document.prototype.hasFootnotes = function () {
  return this['$footnotes?']();
};

/**
 * @memberof Document
 */
Document.prototype.getFootnotes = function () {
  return this.$footnotes();
};

/**
 * @memberof Document
 */
Document.prototype.isEmbedded = function () {
  return this['$embedded?']();
};

/**
 * @memberof Document
 */
Document.prototype.hasExtensions = function () {
  return this['$extensions?']();
};

/**
 * @memberof Document
 */
Document.prototype.getDoctype = function () {
  return this.doctype;
};

/**
 * @memberof Document
 */
Document.prototype.getBackend = function () {
  return this.backend;
};

/**
 * @memberof Document
 */
Document.prototype.isBasebackend = function (base) {
  return this['$basebackend?'](base);
};

/**
 * Get the title explicitly defined in the document attributes.
 * @returns {string}
 * @see {@link AbstractNode#getAttributes}
 * @memberof Document
 */
Document.prototype.getTitle = function () {
  var title = this.$title();
  return title === Opal.nil ? undefined : title;
};

/**
 * @memberof Document
 */
Document.prototype.setTitle = function (title) {
  return this['$title='](title);
};

/**
 * @memberof Document
 * @returns {Document/Title} - returns a {@link Document/Title}
 */
Document.prototype.getDocumentTitle = function (options) {
  var doctitle = this.$doctitle(toHash(options));
  return doctitle === Opal.nil ? undefined : doctitle;
};

/**
 * @memberof Document
 * @see {@link Document#getDocumentTitle}
 */
Document.prototype.getDoctitle = Document.prototype.getDocumentTitle;

/**
 * Get the document catalog Hash.
 * @memberof Document
 */
Document.prototype.getCatalog = function () {
  return fromHash(this.catalog);
};

/**
 * @memberof Document
 */
Document.prototype.getReferences = Document.prototype.getCatalog;

/**
 * Get the document revision date from document header (document attribute <code>revdate</code>).
 * @memberof Document
 */
Document.prototype.getRevisionDate = function () {
  return this.getAttribute('revdate');
};

/**
 * @memberof Document
 * @see Document#getRevisionDate
 */
Document.prototype.getRevdate = function () {
  return this.getRevisionDate();
};

/**
 * Get the document revision number from document header (document attribute <code>revnumber</code>).
 * @memberof Document
 */
Document.prototype.getRevisionNumber = function () {
  return this.getAttribute('revnumber');
};

/**
 * Get the document revision remark from document header (document attribute <code>revremark</code>).
 * @memberof Document
 */
Document.prototype.getRevisionRemark = function () {
  return this.getAttribute('revremark');
};

// private constructor
Document.RevisionInfo = function (date, number, remark) {
  this.date = date;
  this.number = number;
  this.remark = remark;
};

/**
 * @class
 * @namespace
 * @module Document/RevisionInfo
 */
var RevisionInfo = Document.RevisionInfo;

/**
 * Get the document revision date from document header (document attribute <code>revdate</code>).
 * @memberof Document/RevisionInfo
 */
RevisionInfo.prototype.getDate = function () {
  return this.date;
};

/**
 * Get the document revision number from document header (document attribute <code>revnumber</code>).
 * @memberof Document/RevisionInfo
 */
RevisionInfo.prototype.getNumber = function () {
  return this.number;
};

/**
 * Get the document revision remark from document header (document attribute <code>revremark</code>).
 * A short summary of changes in this document revision.
 * @memberof Document/RevisionInfo
 */
RevisionInfo.prototype.getRemark = function () {
  return this.remark;
};

/**
 * @memberof Document/RevisionInfo
 * @returns {boolean} - returns true if the revision info is empty (ie. not defined), otherwise false
 */
RevisionInfo.prototype.isEmpty = function () {
  return this.date === undefined && this.number === undefined && this.remark === undefined;
};

/**
 * @memberof Document
 * @returns {Document/RevisionInfo} - returns a {@link Document/RevisionInfo}
 */
Document.prototype.getRevisionInfo = function () {
  return new Document.RevisionInfo(this.getRevisionDate(), this.getRevisionNumber(), this.getRevisionRemark());
};

/**
 * @memberof Document
 * @returns {boolean} - returns true if the document contains revision info, otherwise false
 */
Document.prototype.hasRevisionInfo = function () {
  var revisionInfo = this.getRevisionInfo();
  return !revisionInfo.isEmpty();
};

/**
 * @memberof Document
 */
Document.prototype.getNotitle = function () {
  return this.$notitle();
};

/**
 * @memberof Document
 */
Document.prototype.getNoheader = function () {
  return this.$noheader();
};

/**
 * @memberof Document
 */
Document.prototype.getNofooter = function () {
  return this.$nofooter();
};

/**
 * @memberof Document
 */
Document.prototype.hasHeader = function () {
  return this['$header?']();
};

/**
 * @memberof Document
 */
Document.prototype.deleteAttribute = function (name) {
  return this.$delete_attribute(name);
};

/**
 * @memberof Document
 */
Document.prototype.isAttributeLocked = function (name) {
  return this['$attribute_locked?'](name);
};

/**
 * @memberof Document
 */
Document.prototype.parse = function (data) {
  return this.$parse(data);
};

/**
 * @memberof Document
 */
Document.prototype.getDocinfo = function (docinfoLocation, suffix) {
  return this.$docinfo(docinfoLocation, suffix);
};

/**
 * @memberof Document
 */
Document.prototype.hasDocinfoProcessors = function (docinfoLocation) {
  return this['$docinfo_processors?'](docinfoLocation);
};

/**
 * @memberof Document
 */
Document.prototype.counterIncrement = function (counterName, block) {
  return this.$counter_increment(counterName, block);
};

/**
 * @memberof Document
 */
Document.prototype.counter = function (name, seed) {
  return this.$counter(name, seed);
};

/**
 * @memberof Document
 */
Document.prototype.getSafe = function () {
  return this.safe;
};

/**
 * @memberof Document
 */
Document.prototype.getCompatMode = function () {
  return this.compat_mode;
};

/**
 * @memberof Document
 */
Document.prototype.getSourcemap = function () {
  return this.sourcemap;
};

/**
 * @memberof Document
 */
Document.prototype.getCounters = function () {
  return fromHash(this.counters);
};

/**
 * @memberof Document
 */
Document.prototype.getCallouts = function () {
  return this.$callouts();
};

/**
 * @memberof Document
 */
Document.prototype.getBaseDir = function () {
  return this.base_dir;
};

/**
 * @memberof Document
 */
Document.prototype.getOptions = function () {
  return fromHash(this.options);
};

/**
 * @memberof Document
 */
Document.prototype.getOutfilesuffix = function () {
  return this.outfilesuffix;
};

/**
 * @memberof Document
 */
Document.prototype.getParentDocument = function () {
  return this.parent_document;
};

/**
 * @memberof Document
 */
Document.prototype.getReader = function () {
  return this.reader;
};

/**
 * @memberof Document
 */
Document.prototype.getConverter = function () {
  return this.converter;
};

/**
 * @memberof Document
 */
Document.prototype.getExtensions = function () {
  return this.extensions;
};

// Document.Title API

/**
 * @namespace
 * @module Document/Title
 */
var Title = Document.Title;

/**
 * @memberof Document/Title
 */
Title.prototype.getMain = function () {
  return this.main;
};

/**
 * @memberof Document/Title
 */
Title.prototype.getCombined = function () {
  return this.combined;
};

/**
 * @memberof Document/Title
 */
Title.prototype.getSubtitle = function () {
  var subtitle = this.subtitle;
  return subtitle === Opal.nil ? undefined : subtitle;
};

/**
 * @memberof Document/Title
 */
Title.prototype.isSanitized = function () {
  var sanitized = this['$sanitized?']();
  return sanitized === Opal.nil ? false : sanitized;
};

/**
 * @memberof Document/Title
 */
Title.prototype.hasSubtitle = function () {
  return this['$subtitle?']();
};

// Inline API

/**
 * @namespace
 * @extends AbstractNode
 */
var Inline = Opal.Asciidoctor.Inline;

/**
 * Get the converted content for this inline node.
 *
 * @memberof Inline
 * @returns {string} - returns the converted String content for this inline node
 */
Inline.prototype.convert = function () {
  return this.$convert();
};

/**
 * Get the converted String text of this Inline node, if applicable.
 *
 * @memberof Inline
 * @returns {string} - returns the converted String text for this Inline node, or undefined if not applicable for this node.
 */
Inline.prototype.getText = function () {
  var text = this.$text();
  return text === Opal.nil ? undefined : text;
};

/**
 * Get the String sub-type (aka qualifier) of this Inline node.
 *
 * This value is used to distinguish different variations of the same node
 * category, such as different types of anchors.
 *
 * @memberof Inline
 * @returns {string} - returns the string sub-type of this Inline node.
 */
Inline.prototype.getType = function () {
  return this.$type();
};

/**
 * Get the primary String target of this Inline node.
 *
 * @memberof Inline
 * @returns {string} - returns the string target of this Inline node.
 */
Inline.prototype.getTarget = function () {
  var target = this.$target();
  return target === Opal.nil ? undefined : target;
};

// List API

/** @namespace */
var List = Opal.Asciidoctor.List;

/**
 * Get the Array of {@link ListItem} nodes for this {@link List}.
 *
 * @memberof List
 * @returns {Array} - returns an Array of {@link ListItem} nodes.
 */
List.prototype.getItems = function () {
  return this.blocks;
};

// ListItem API

/** @namespace */
var ListItem = Opal.Asciidoctor.ListItem;

/**
 * Get the converted String text of this ListItem node.
 *
 * @memberof ListItem
 * @returns {string} - returns the converted String text for this ListItem node.
 */
ListItem.prototype.getText = function () {
  return this.$text();
};

// Reader API

/** @namespace */
var Reader = Opal.Asciidoctor.Reader;

/**
 * @memberof Reader
 */
Reader.prototype.pushInclude = function (data, file, path, lineno, attributes) {
  return this.$push_include(data, file, path, lineno, toHash(attributes));
};

/**
 * Get the current location of the reader's cursor, which encapsulates the
 * file, dir, path, and lineno of the file being read.
 *
 * @memberof Reader
 */
Reader.prototype.getCursor = function () {
  return this.$cursor();
};

/**
 * Get a copy of the remaining {Array} of String lines managed by this Reader.
 *
 * @memberof Reader
 * @returns {Array} - returns A copy of the String {Array} of lines remaining in this Reader.
 */
Reader.prototype.getLines = function () {
  return this.$lines();
};

/**
 * Get the remaining lines managed by this Reader as a String.
 *
 * @memberof Reader
 * @returns {string} - returns The remaining lines managed by this Reader as a String (joined by linefeed characters).
 */
Reader.prototype.getString = function () {
  return this.$string();
};

// Cursor API

/** @namespace */
var Cursor = Opal.Asciidoctor.Reader.Cursor;

/**
 * Get the file associated to the cursor.
 * @memberof Cursor
 */
Cursor.prototype.getFile = function () {
  var file = this.file;
  return file === Opal.nil ? undefined : file;
};

/**
 * Get the directory associated to the cursor.
 * @memberof Cursor
 * @returns {string} - returns the directory associated to the cursor
 */
Cursor.prototype.getDirectory = function () {
  var dir = this.dir;
  return dir === Opal.nil ? undefined : dir;
};

/**
 * Get the path associated to the cursor.
 * @memberof Cursor
 * @returns {string} - returns the path associated to the cursor (or '<stdin>')
 */
Cursor.prototype.getPath = function () {
  var path = this.path;
  return path === Opal.nil ? undefined : path;
};

/**
 * Get the line number of the cursor.
 * @memberof Cursor
 * @returns {number} - returns the line number of the cursor
 */
Cursor.prototype.getLineNumber = function () {
  return this.lineno;
};

// Logger API (available in Asciidoctor 1.5.7+)
// REMIND: we are using "skip_missing" because this API is only available starting with Asciidoctor 1.5.7

/**
 * @namespace
 */
var LoggerManager = Opal.const_get_qualified(Opal.Asciidoctor, 'LoggerManager', true);

// Alias
Opal.Asciidoctor.LoggerManager = LoggerManager;

if (LoggerManager) {
  LoggerManager.getLogger = function () {
    return this.$logger();
  };

  LoggerManager.setLogger = function (logger) {
    this.logger = logger;
  };
}

/**
 * @namespace
 */
var MemoryLogger = Opal.const_get_qualified(Opal.Asciidoctor, 'MemoryLogger', true);

// Alias
Opal.Asciidoctor.MemoryLogger = MemoryLogger;

if (MemoryLogger) {
  MemoryLogger.prototype.getMessages = function () {
    var messages = this.messages;
    var result = [];
    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      var messageObject = fromHash(message);
      // also convert the message attribute
      messageObject.message = fromHash(messageObject.message);
      result.push(messageObject);
    }
    return result;
  };
}
